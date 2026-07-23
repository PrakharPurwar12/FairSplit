# FairSplit Backend

An AI-powered backend for **FairSplit**, a project management platform that automates fair task allocation, predicts task completion risks using Machine Learning, and provides analytics to improve team productivity.

Built using **Django**, **Django REST Framework**, **JWT Authentication**, and **Scikit-learn**.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected REST APIs

### Skills Management
- Create Skills
- Update Skills
- Delete Skills
- Assign Skills to Users
- Manage Skill Proficiency Levels

### Project Management
- Create Projects
- Update Projects
- Delete Projects
- Add Project Members
- Manage Team Members

### Task Management
- Create Tasks
- Update Tasks
- Delete Tasks
- Task Priorities
- Task Difficulty Levels
- Task Deadlines
- Task Status Tracking
- Completion Percentage
- Estimated & Actual Hours
- Required Skills for Tasks

---

# AI Modules

## Fair Task Allocation Engine

Automatically assigns tasks to the most suitable team member based on:

- Skill Matching
- Skill Proficiency
- Required Skills
- Current Workload
- Fairness Penalty
- Confidence Score

### Allocation Formula

```
Skill Score = Proficiency × Importance

Workload Score = Maximum Workload − Assigned Hours

Final Score =
(0.7 × Skill Score)
+
(0.3 × Workload Score)
− Fairness Penalty
```

The highest scoring member receives the task assignment.

The allocation engine also stores:

- Assignment History
- Allocation Confidence
- Assignment Reason
- Matched Skills

---

## AI Risk Prediction

The backend includes a Machine Learning model that predicts whether a task is at risk of missing its deadline.

### Model

Random Forest Classifier

### Input Features

- Estimated Hours
- Difficulty
- Priority
- Required Skills
- Skill Score
- Workload Score
- Active Tasks
- Days Remaining
- Completion Percentage

### Prediction Classes

- Low Risk
- Medium Risk
- High Risk

Prediction is automatically generated whenever task progress is updated.

---

## AI Reassignment Recommendation

If a task is predicted as **High Risk**, the backend recommends a better team member by reusing the allocation algorithm.

Recommendation considers:

- Skill Match
- Current Workload
- Fairness
- Allocation Score

The final reassignment decision remains with the project manager.

---

# Analytics Module

The backend provides APIs for project analytics.

## Project Dashboard

Returns:

- Total Tasks
- Completed Tasks
- In Progress Tasks
- Review Tasks
- Todo Tasks
- Completion Percentage
- Risk Distribution

---

## Member Analytics

Returns:

- Assigned Tasks
- Completed Tasks
- Active Tasks
- Estimated Hours
- Actual Hours
- Average Completion
- Workload Score

---

## Team Analytics

Returns analytics for every project member including:

- Assigned Tasks
- Completed Tasks
- Active Tasks
- Estimated Hours
- Actual Hours
- Average Completion
- Workload Score

---

## Risk Analytics

Returns:

- High Risk Tasks
- Medium Risk Tasks
- Low Risk Tasks
- Average Prediction Confidence
- High Risk Percentage
- High Risk Task Details

---

# Technology Stack

## Backend

- Python 3.x
- Django
- Django REST Framework

## Database

- SQLite

## Authentication

- JWT (SimpleJWT)

## Machine Learning

- Scikit-learn
- Random Forest Classifier
- Joblib

## API Testing

- Postman

---

# Project Structure

```
backend/
│
├── account/
├── allocation/
├── analytics/
├── ml/
├── projects/
├── skills/
├── tasks/
│
├── FairSplit/
│
├── manage.py
├── requirements.txt
└── README.md
```

---

# Backend Architecture

```
                Client
                   │
                   ▼
          Django REST APIs
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
 Authentication  Projects      Tasks
                   │
                   ▼
        Fair Allocation Engine
                   │
                   ▼
          Task Assignments
                   │
                   ▼
      Task Progress Updates
                   │
                   ▼
      Machine Learning Model
                   │
                   ▼
        Risk Prediction Engine
                   │
                   ▼
 AI Reassignment Recommendation
                   │
                   ▼
          Analytics APIs
```

---

# Database Modules

## account

Handles:

- User Authentication
- JWT Login
- User Registration

---

## skills

Models:

- Skill
- UserSkill

Responsible for maintaining skill information and proficiency levels.

---

## projects

Models:

- Project
- ProjectMember

Responsible for project creation and member management.

---

## tasks

Models:

- Task
- TaskSkill
- TaskAssignment
- AssignmentHistory

Responsible for task lifecycle and assignment tracking.

---

## allocation

Contains:

- Fair Allocation Algorithm
- Workload Calculation
- Skill Scoring
- Confidence Calculation
- Assignment Recommendation

---

## ml

Contains:

- Random Forest Model
- Prediction Logic
- Model Loading
- Feature Processing

---

## analytics

Provides dashboard APIs for:

- Projects
- Members
- Teams
- Risks

---

# API Modules

- Authentication
- Skills
- Projects
- Project Members
- Tasks
- Task Skills
- Fair Allocation
- AI Prediction
- AI Recommendation
- Analytics

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/FairSplit.git
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Create Superuser

```bash
python manage.py createsuperuser
```

## Run Development Server

```bash
python manage.py runserver
```

The backend will be available at:

```
http://127.0.0.1:8000/
```

---

# Future Enhancements

- Docker Support
- PostgreSQL Integration
- CI/CD Pipeline
- Email Notifications
- Real-time WebSocket Notifications
- Explainable AI (XAI)
- AI-based Team Formation
- Contribution Score Prediction

---



# License

This project was developed as part of an academic M.Tech project and is intended for educational and research purposes.