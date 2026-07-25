# FRONTEND_INTEGRATION_MASTER_GUIDE

======================================================================
1. PROJECT OVERVIEW
======================================================================
- Django version: 6.0.7
- Python version: 3.x
- DRF version: 3.x
- Database: SQLite3 (Local)
- Installed apps: `account`, `skills`, `project`, `allocation`, `prediction`, `analytics`, `notifications`, `tasks`
- Authentication: Custom User model (`account.User`)
- JWT: `rest_framework_simplejwt` (JWTAuthentication)
- Base URL: `http://127.0.0.1:8000/api/`
- CORS: `CORS_ALLOW_ALL_ORIGINS = True`
- Environment variables: Managed via `python-decouple`
- Media: `Profile_picture` uses `URLField` (no `MEDIA_ROOT` configured for file uploads)
- Static: `STATIC_URL = 'static/'`

======================================================================
2. COMPLETE PROJECT STRUCTURE
======================================================================
```
backend/
├── account/             # User authentication and profiles
├── allocation/          # Task allocation logic
├── analytics/           # Dashboard analytics and metrics
├── backend/             # Core settings and root URLs
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── datasets/            # Machine learning datasets
├── ml/                  # ML models and prediction engine
├── notifications/       # User notification system
├── prediction/          # Django prediction wrappers
├── project/             # Project and member management
├── skills/              # User skills and competencies
├── tasks/               # Task tracking and assignments
├── manage.py
├── db.sqlite3
└── requirements.txt
```

======================================================================
3. COMPLETE URL MAP
======================================================================
POST /api/account/login/
POST /api/account/register/
POST /api/account/refresh/
GET /api/account/profile/
GET /api/projects/
POST /api/projects/
GET /api/projects/{id}/
PUT /api/projects/{id}/
PATCH /api/projects/{id}/
DELETE /api/projects/{id}/
GET /api/projects/{project_id}/members/
POST /api/projects/{project_id}/members/
DELETE /api/projects/members/{id}/
GET /api/tasks/
POST /api/tasks/
GET /api/tasks/{id}/
PUT /api/tasks/{id}/
PATCH /api/tasks/{id}/
DELETE /api/tasks/{id}/
PATCH /api/tasks/{task_id}/progress/
GET /api/tasks/{task_id}/skills/
POST /api/tasks/{task_id}/skills/
GET /api/skills/
GET /api/allocation/
GET /api/analytics/
GET /api/ml/

======================================================================
4. COMPLETE API CONTRACT
======================================================================

### POST /api/account/register/
- HTTP Method: POST
- URL: `/api/account/register/`
- Authentication Required: No
- Permission Class: AllowAny
- View/ViewSet Name: RegisterView
- Serializer Name: RegisterSerializer
- Request JSON: `{"username": "johndoe", "first_name": "John", "last_name": "Doe", "email": "john@example.com", "password": "securepassword123"}`
- Response JSON: `{"id": 1, "username": "johndoe", "first_name": "John", "last_name": "Doe", "email": "john@example.com", "role": "member", "experience": 0, "availability_hours": 40, "profile_picture": null}`
- Validation Rules: Password min 8 chars. Username unique.
- Possible Error Responses: `{"username": ["A user with that username already exists."]}`
- Headers Required: None
- Path Parameters: None
- Query Parameters: None
- Status Codes: 201 Created, 400 Bad Request
- Writable Fields: `username`, `first_name`, `last_name`, `email`, `password`, `role`, `experience`, `availability_hours`, `profile_picture`
- Read-only Fields: `id`
- Nullable Fields: `profile_picture`
- Filtering/Searching/Ordering/Pagination: None

### POST /api/account/login/
- HTTP Method: POST
- URL: `/api/account/login/`
- Authentication Required: No
- Permission Class: AllowAny
- View/ViewSet Name: TokenObtainPairView
- Serializer Name: TokenObtainPairSerializer
- Request JSON: `{"username": "johndoe", "password": "securepassword123"}`
- Response JSON: `{"access": "eyJhbGciOi...", "refresh": "eyJhbGciOi..."}`
- Validation Rules: Must match valid active user.
- Possible Error Responses: `{"detail": "No active account found with the given credentials"}`
- Headers Required: None
- Path Parameters: None
- Query Parameters: None
- Status Codes: 200 OK, 401 Unauthorized
- Writable Fields: `username`, `password`
- Read-only Fields: `access`, `refresh`
- Nullable Fields: None
- Filtering/Searching/Ordering/Pagination: None

### GET /api/account/profile/
- HTTP Method: GET
- URL: `/api/account/profile/`
- Authentication Required: Yes
- Permission Class: IsAuthenticated
- View/ViewSet Name: ProfileView
- Serializer Name: ProfileSerializer
- Request JSON: None
- Response JSON: `{"id": 1, "username": "johndoe", "first_name": "John", "last_name": "Doe", "email": "john@example.com", "role": "manager", "experience": 5, "availability_hours": 40, "profile_picture": null}`
- Validation Rules: None
- Possible Error Responses: `{"detail": "Authentication credentials were not provided."}`
- Headers Required: `Authorization: Bearer <token>`
- Path Parameters: None
- Query Parameters: None
- Status Codes: 200 OK, 401 Unauthorized
- Writable Fields: None (GET only)
- Read-only Fields: All
- Nullable Fields: `profile_picture`
- Filtering/Searching/Ordering/Pagination: None

### GET, POST /api/projects/
- HTTP Method: GET, POST
- URL: `/api/projects/`
- Authentication Required: Yes
- Permission Class: IsAuthenticated
- View/ViewSet Name: ProjectListCreateView
- Serializer Name: ProjectSerializer
- Request JSON (POST): `{"title": "New Project", "description": "Desc", "start_date": "2026-07-01", "end_date": "2026-08-01", "status": "planning"}`
- Response JSON (GET returns array): `[{"id": 1, "title": "New Project", "description": "Desc", "manager": 1, "manager_name": "johndoe", "start_date": "2026-07-01", "end_date": "2026-08-01", "status": "planning", "created_at": "2026-07-25T12:00:00Z", "updated_at": "2026-07-25T12:00:00Z"}]`
- Validation Rules: `start_date` and `end_date` must be YYYY-MM-DD.
- Possible Error Responses: 400 Bad Request if fields missing.
- Headers Required: `Authorization: Bearer <token>`
- Path Parameters: None
- Query Parameters: None
- Status Codes: 200 OK (GET), 201 Created (POST)
- Writable Fields: `title`, `description`, `start_date`, `end_date`, `status`
- Read-only Fields: `id`, `manager`, `manager_name`, `created_at`, `updated_at` (manager is auto-set to request.user)
- Nullable Fields: None
- Filtering/Searching/Ordering/Pagination: Filters implicitly to `manager=self.request.user`. No pagination yet.

### GET, POST /api/tasks/
- HTTP Method: GET, POST
- URL: `/api/tasks/`
- Authentication Required: Yes
- Permission Class: IsAuthenticated
- View/ViewSet Name: TaskListCreateView
- Serializer Name: TaskSerializer
- Request JSON (POST): `{"project": 1, "title": "Task 1", "description": "Desc", "estimated_hours": "5.00", "difficulty": 3, "priority": "high", "deadline": "2026-07-30"}`
- Response JSON (GET returns array): `[{"id": 1, "project": 1, "project_name": "New Project", "title": "Task 1", "description": "Desc", "estimated_hours": "5.00", "actual_hours": "0.00", "difficulty": 3, "priority": "high", "deadline": "2026-07-30", "status": "todo", "completion_percentage": 0, "predicted_risk": "Unknown", "risk_confidence": 0.0, "last_risk_update": null, "created_by": 1, "created_by_name": "johndoe", "created_at": "2026-07-25T...", "updated_at": "2026-07-25T..."}]`
- Validation Rules: `difficulty` 1-5. `priority` (low/medium/high).
- Headers Required: `Authorization: Bearer <token>`
- Status Codes: 200 OK (GET), 201 Created (POST)
- Writable Fields: `project`, `title`, `description`, `estimated_hours`, `actual_hours`, `difficulty`, `priority`, `deadline`, `status`, `completion_percentage`
- Read-only Fields: `id`, `project_name`, `predicted_risk`, `risk_confidence`, `last_risk_update`, `created_by`, `created_by_name`, `created_at`, `updated_at`
- Nullable Fields: `last_risk_update`
- Filtering/Searching/Ordering/Pagination: Filters implicitly to `created_by=self.request.user`.

### PATCH /api/tasks/{task_id}/progress/
- HTTP Method: PATCH
- URL: `/api/tasks/{task_id}/progress/`
- Authentication Required: Yes
- Permission Class: IsAuthenticated
- View/ViewSet Name: TaskProgressUpdateView
- Serializer Name: TaskProgressUpdateSerializer
- Request JSON: `{"completion_percentage": 50, "actual_hours": "2.50"}`
- Response JSON: `{"message": "Task updated successfully.", "prediction": {"predicted_risk": "Low", "confidence": 0.95}, "task": { ...full task object... }}`
- Validation Rules: You must be the assigned member (`assignment.assigned_to == request.user`). `completion_percentage` 0-100.
- Possible Error Responses: 400 "Task has not been assigned.", 403 "You are not assigned to this task."
- Headers Required: `Authorization: Bearer <token>`
- Path Parameters: `task_id` (integer)
- Query Parameters: None
- Status Codes: 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found
- Writable Fields: `completion_percentage`, `actual_hours`
- Read-only Fields: All others.
- Nullable Fields: None

======================================================================
5. COMPLETE SERIALIZER REFERENCE
======================================================================

### RegisterSerializer
- Fields: `id`, `username`, `first_name`, `last_name`, `email`, `role`, `experience`, `availability_hours`, `profile_picture`, `password`
- Read Only Fields: `id`
- Write Only Fields: `password`

### ProfileSerializer
- Fields: `id`, `username`, `first_name`, `last_name`, `email`, `role`, `experience`, `availability_hours`, `profile_picture`
- Read Only Fields: All fields (It's a ModelSerializer, but ProfileView is usually read-only if implemented as RetrieveAPIView, NOT VERIFIED if it supports PUT/PATCH).

### ProjectSerializer
- Fields: `id`, `title`, `description`, `manager`, `manager_name`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`
- Read Only Fields: `id`, `manager`, `manager_name`, `created_at`, `updated_at`
- Write Only Fields: None

### ProjectMemberSerializer
- Fields: `id`, `project`, `user`, `username`, `role`, `joined_at`
- Read Only Fields: `id`, `username`, `joined_at`
- Write Only Fields: None

### TaskSerializer
- Fields: `id`, `project`, `project_name`, `title`, `description`, `estimated_hours`, `actual_hours`, `difficulty`, `priority`, `deadline`, `status`, `completion_percentage`, `predicted_risk`, `risk_confidence`, `last_risk_update`, `created_by`, `created_by_name`, `created_at`, `updated_at`
- Read Only Fields: `id`, `project_name`, `created_by`, `created_by_name`, `created_at`, `updated_at`, `predicted_risk`, `risk_confidence`, `last_risk_update`

### TaskProgressUpdateSerializer
- Fields: `completion_percentage`, `actual_hours`
- Read Only Fields: None

### TaskAssignmentSerializer
- Fields: `id`, `task`, `assigned_to`, `assigned_to_name`, `assigned_by`, `assigned_at`
- Read Only Fields: `id`, `assigned_to_name`, `assigned_by`, `assigned_at`

======================================================================
6. COMPLETE MODEL REFERENCE
======================================================================

### User (account)
- Fields: `role`, `experience`, `availability_hours`, `profile_picture`, `created_at`, `updated_at`
- Choices: `role` (manager, member)
- Defaults: `role`="member", `experience`=0, `availability_hours`=40
- Relationships: Inherits AbstractUser.

### Project (project)
- Fields: `title`, `description`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`
- Relationships: `manager` (ForeignKey to User)
- Choices: `status` (planning, active, completed)
- Defaults: `status`="planning"

### ProjectMember (project)
- Fields: `role`, `joined_at`
- Relationships: `project` (ForeignKey), `user` (ForeignKey)
- Choices: `role` (frontend, backend, fullstack, ml, tester, designer)
- Unique Constraints: `("project", "user")`

### Task (tasks)
- Fields: `title`, `description`, `estimated_hours`, `actual_hours`, `difficulty`, `priority`, `deadline`, `status`, `completion_percentage`, `predicted_risk`, `risk_confidence`, `last_risk_update`, `created_at`, `updated_at`
- Relationships: `project` (ForeignKey), `created_by` (ForeignKey)
- Choices: `priority` (low, medium, high), `status` (todo, progress, review, completed), `predicted_risk` (Low, Medium, High, Unknown)
- Defaults: `actual_hours`=0, `difficulty`=3, `status`="todo", `completion_percentage`=0, `predicted_risk`="Unknown", `risk_confidence`=0

### TaskAssignment (tasks)
- Relationships: `task` (OneToOneField), `assigned_to` (ForeignKey), `assigned_by` (ForeignKey)

======================================================================
7. AUTHENTICATION GUIDE
======================================================================
- Register: POST `/api/account/register/` to create account. Returns 201 on success.
- Login: POST `/api/account/login/` with username/password. Returns `access` (JWT) and `refresh` token.
- Refresh: POST `/api/account/refresh/` with `{"refresh": "<token>"}` to get a new access token.
- Logout: Erase tokens from frontend storage (Local Storage / Session Storage). No backend invalidation required since `BLACKLIST_AFTER_ROTATION` is False.
- JWT Access Token Expiry: 24 Hours.
- JWT Refresh Token Expiry: 7 Days.
- Authorization Header: `Authorization: Bearer <access_token>`
- Storage Recommendation: Store `access` token in memory or LocalStorage, `refresh` token in HttpOnly cookie if possible, otherwise LocalStorage.
- Protected Route Flow: Validate `access` token existence before rendering Dashboard. If API calls return 401, attempt refresh. If refresh fails, redirect to Login.

======================================================================
8. DASHBOARD DATA MAPPING
======================================================================
- Topbar (User Profile) ↓ GET `/api/account/profile/`
- Sidebar (Projects List) ↓ GET `/api/projects/`
- Project Switcher ↓ GET `/api/projects/`
- Dashboard Cards (Stats) ↓ GET `/api/analytics/` (NOT VERIFIED fully, stubbed)
- Recent Activity ↓ GET `/api/analytics/activity/` (NOT VERIFIED)
- AI Insights ↓ GET `/api/ml/insights/` (NOT VERIFIED)
- Tasks Table ↓ GET `/api/tasks/`
- Prediction Updates ↓ PATCH `/api/tasks/{id}/progress/` (Returns prediction inside response)

======================================================================
9. FRONTEND DATA TYPES
======================================================================
- `id` → integer
- `title` / `description` / `name` → string
- `estimated_hours` / `actual_hours` → decimal string (e.g. `"5.00"`)
- `start_date` / `end_date` / `deadline` → date string (`"YYYY-MM-DD"`)
- `created_at` / `updated_at` / `last_risk_update` → datetime string (ISO 8601)
- `difficulty` / `completion_percentage` / `experience` → integer
- `risk_confidence` → float (e.g. `0.95`)
- `status` / `priority` / `role` / `predicted_risk` → enum string
- `manager` / `project` / `created_by` → integer (Foreign Key ID)
- `profile_picture` → string|null

======================================================================
10. KNOWN LIMITATIONS
======================================================================
- Notifications are completely stubbed out.
- Analytics and ML integrations are partial/stubbed.
- Profile picture is a `URLField` string; the backend will NOT handle multipart form-data image uploads. You must upload to Cloudinary/AWS and send the URL.
- `GET /api/projects/` strictly returns projects where `manager=request.user`.
- Task History is recorded but currently lacks a dedicated GET endpoint.

======================================================================
11. INTEGRATION RISKS
======================================================================
- Decimal strings: `estimated_hours` and `actual_hours` will arrive as strings like `"10.50"`. React must parse them using `parseFloat()` before doing math.
- Nullable fields: `profile_picture` and `last_risk_update` can be `null`.
- Nested objects missing: The API returns `project_name` and `created_by_name` as read-only fields on Tasks, but does NOT nest the full Project or User object.
- POST creation missing IDs: Ensure you do NOT send `"id"` when POSTing to `/api/tasks/` or `/api/projects/`.
- Trailing slashes: Django strict URLs require trailing slashes (`/api/projects/` not `/api/projects`).

======================================================================
12. FINAL FRONTEND IMPLEMENTATION ORDER
======================================================================
1. Axios Configuration (Setup interceptors & base URL)
2. Authentication (Login & Register APIs)
3. Protected Routes (Wire auth context to Router)
4. Profile (Populate Topbar)
5. Projects (Populate Switcher & Sidebar)
6. Tasks (Populate Overview & task logic)
7. Task Progress Updates (Wire up ML prediction responses)
8. Dashboard Analytics (Wire up remaining stubs)
9. Notifications (Defer until backend implements)

======================================================================
13. FINAL CHECKLIST
======================================================================
□ Axios configured with interceptors
□ Login integrated and storing tokens
□ Register integrated
□ JWT refresh logic working
□ ProtectedRoute working
□ Profile fetched on load
□ Projects fetched and updating Switcher
□ Tasks fetched
□ Task progress PATCH working
□ ML predictions updating in UI
□ Build passes
□ Lint passes
□ Production ready
