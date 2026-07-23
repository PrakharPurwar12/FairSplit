from collections import defaultdict

from project.models import ProjectMember
from tasks.models import Task, TaskAssignment


class WorkloadManager:

    def __init__(self, project):
        self.project = project
        self.workloads = defaultdict(float)

        assignments = TaskAssignment.objects.filter(
            task__project=project
        ).select_related("task")

        for assignment in assignments:
            self.workloads[
                assignment.assigned_to_id
            ] += float(assignment.task.estimated_hours)

    def get(self, user_id):
        return self.workloads[user_id]

    def add(self, user_id, hours):
        self.workloads[user_id] += float(hours)