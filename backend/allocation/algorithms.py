from collections import defaultdict
from project.models import ProjectMember
from skills.models import UserSkill
from tasks.models import (
    Task,
    TaskSkill,
    TaskAssignment,
    AssignmentHistory,
)
from django.utils import timezone
from tasks.models import TaskSkill, TaskAssignment

# ======================================================
# Configuration
# ======================================================

MAX_WORKLOAD = 40  # hours

SKILL_WEIGHT = 0.7
WORKLOAD_WEIGHT = 0.3


# ======================================================
# Skill Score
# ======================================================

def calculate_skill_score(member, task):
    score = 0
    matched_skills = []

    required_skills = TaskSkill.objects.filter(task=task)

    for requirement in required_skills:

        try:
            user_skill = UserSkill.objects.get(
                user=member.user,
                skill=requirement.skill
            )

            score += (
                user_skill.proficiency *
                requirement.importance
            )

            matched_skills.append(requirement.skill.name)

        except UserSkill.DoesNotExist:
            continue

    return score, matched_skills


# ======================================================
# Current Workload
# ======================================================

def get_current_workloads(project):

    workloads = defaultdict(float)

    assignments = (
        TaskAssignment.objects
        .filter(task__project=project)
        .select_related("task")
    )

    for assignment in assignments:

        workloads[
            assignment.assigned_to_id
        ] += float(assignment.task.estimated_hours)

    return workloads


# ======================================================
# Eligibility
# ======================================================

def is_member_eligible(member, workloads):

    if not member.user.is_active:
        return False

    if workloads[member.user.id] >= MAX_WORKLOAD:
        return False

    return True


# ======================================================
# Workload Score
# ======================================================

def calculate_workload_score(current_hours):

    utilization = current_hours / MAX_WORKLOAD

    score = (1 - utilization) * 100

    return max(0, round(score, 2))


# ======================================================
# Fairness Penalty
# ======================================================

def calculate_fairness_penalty(member):

    assignment_count = TaskAssignment.objects.filter(
        assigned_to=member.user
    ).count()

    return assignment_count * 5


# ======================================================
# Final Score
# ======================================================

def calculate_final_score(
    skill_score,
    workload_score,
    penalty,
):

    return round(
        (
            SKILL_WEIGHT * skill_score
        )
        +
        (
            WORKLOAD_WEIGHT * workload_score
        )
        -
        penalty,
        2
    )


# ======================================================
# Confidence Score
# ======================================================

def calculate_confidence(best_score, second_best_score):

    if second_best_score <= 0:
        return 100

    confidence = (
        (best_score - second_best_score)
        / best_score
    ) * 100

    confidence = max(0, min(confidence, 100))

    return round(confidence, 2)


# ======================================================
# Assignment Reason
# ======================================================

def generate_reason(
    matched_skills,
    workload_score,
    penalty,
):

    reasons = []

    if matched_skills:
        reasons.append(
            "Matched skills: "
            + ", ".join(matched_skills)
        )

    if workload_score >= 70:
        reasons.append(
            "Low current workload"
        )

    elif workload_score >= 40:
        reasons.append(
            "Moderate workload"
        )

    else:
        reasons.append(
            "High workload"
        )

    if penalty > 0:
        reasons.append(
            f"Fairness penalty applied ({penalty})"
        )

    reasons.append(
        "Highest final score among eligible members"
    )

    return reasons


# ======================================================
# Main Allocation Function
# ======================================================

def allocate_tasks(project_id):

    tasks = (
        Task.objects
        .filter(project_id=project_id)
        .order_by("-priority", "-difficulty")
    )

    members = ProjectMember.objects.filter(
        project_id=project_id
    )

    if not tasks.exists():
        return {
            "error": "No tasks found."
        }

    if not members.exists():
        return {
            "error": "No project members found."
        }

    workloads = get_current_workloads(
        tasks.first().project
    )

    results = []

    for task in tasks:

        candidates = []

        for member in members:

            if not is_member_eligible(
                member,
                workloads
            ):
                continue

            skill_score, matched_skills = calculate_skill_score(
                member,
                task
            )

            workload_score = calculate_workload_score(
                workloads[member.user.id]
            )

            penalty = calculate_fairness_penalty(
                member
            )

            final_score = calculate_final_score(
                skill_score,
                workload_score,
                penalty
            )

            candidates.append({

                "member": member,

                "skill_score": skill_score,

                "workload_score": workload_score,

                "penalty": penalty,

                "matched_skills": matched_skills,

                "final_score": final_score,

            })

        if not candidates:
            continue

        candidates.sort(
            key=lambda x: x["final_score"],
            reverse=True
        )

        best = candidates[0]

        second_score = (
            candidates[1]["final_score"]
            if len(candidates) > 1
            else 0
        )

        confidence = calculate_confidence(
            best["final_score"],
            second_score
        )

        reasons = generate_reason(
        best["matched_skills"],
        best["workload_score"],
        best["penalty"]
        )


        previous = TaskAssignment.objects.filter(
            task=task
        ).first()

        TaskAssignment.objects.update_or_create(

            task=task,

            defaults={

                "assigned_to": best["member"].user,

                "assigned_by": task.created_by,

            }

        )

        AssignmentHistory.objects.create(

            task=task,

            previous_member=(
                previous.assigned_to
                if previous else None
            ),

            new_member=best["member"].user,

            changed_by=task.created_by,

            reason="Automatic Fair Allocation",

        )

        workloads[
            best["member"].user.id
        ] += float(task.estimated_hours)

        results.append({

            "task": task.title,

            "assigned_to": best["member"].user.username,

            "skill_score": best["skill_score"],

            "workload_score": best["workload_score"],

            "fairness_penalty": best["penalty"],

            "final_score": best["final_score"],

            "confidence": confidence,
            
            "matched_skills": best["matched_skills"],

            "reason": reasons,

        })

    return results

def build_prediction_features(task):

    assignment = task.assignment

    member = ProjectMember.objects.get(
        project=task.project,
        user=assignment.assigned_to
    )

    # Current workloads
    workloads = get_current_workloads(task.project)

    # Skill score
    skill_score, matched_skills = calculate_skill_score(
        member,
        task
    )

    # Workload score
    workload_score = calculate_workload_score(
        workloads[member.user.id]
    )

    # Required skills
    required_skills = TaskSkill.objects.filter(
        task=task
    ).count()

    # Active tasks
    active_tasks = TaskAssignment.objects.filter(
        assigned_to=member.user,
        task__status__in=["todo", "progress", "review"]
    ).count()

    # Days left
    days_left = max(
        0,
        (task.deadline - timezone.now().date()).days
    )

    return {

        "estimated_hours": float(task.estimated_hours),

        "difficulty": task.difficulty,

        "priority": task.priority,

        "required_skills": required_skills,

        "skill_score": skill_score,

        "workload_score": workload_score,

        "active_tasks": active_tasks,

        "days_left": days_left,

        "completion_percentage": task.completion_percentage,
    }
    
# ======================================================
# AI Reassignment Recommendation
# ======================================================

def recommend_reassignment(task):

    if not hasattr(task, "assignment"):
        return {
            "error": "Task is not assigned."
        }

    current_assignment = task.assignment

    members = ProjectMember.objects.filter(
        project=task.project
    )

    workloads = get_current_workloads(task.project)

    candidates = []

    for member in members:

        # Skip current assignee
        if member.user == current_assignment.assigned_to:
            continue

        # Skip overloaded/inactive members
        if not is_member_eligible(member, workloads):
            continue

        skill_score, matched_skills = calculate_skill_score(
            member,
            task
        )

        workload_score = calculate_workload_score(
            workloads[member.user.id]
        )

        penalty = calculate_fairness_penalty(member)

        final_score = calculate_final_score(
            skill_score,
            workload_score,
            penalty
        )

        candidates.append({

            "member": member,

            "skill_score": skill_score,

            "workload_score": workload_score,

            "penalty": penalty,

            "matched_skills": matched_skills,

            "final_score": final_score,

        })

    if not candidates:

        return {
            "error": "No eligible replacement found."
        }

    candidates.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    best = candidates[0]

    return {

        "recommended_member": best["member"].user,

        "final_score": best["final_score"],

        "reason": generate_reason(
            best["matched_skills"],
            best["workload_score"],
            best["penalty"]
        )
    }
    