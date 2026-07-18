<div align="center">

# 🚀 FairSplit
**An Intelligent, AI-Powered Project Management & Task Allocation Platform**

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Machine Learning](https://img.shields.io/badge/Machine%20Learning-XGBoost%20%7C%20Scikit--Learn-FF6F00?style=for-the-badge&logo=python&logoColor=white)]()

*Bridging the gap between human collaboration and machine intelligence to ensure equitable task distribution and predictable project timelines.*

</div>

<br />

## 📖 The Problem It Solves
In modern software teams, task distribution often suffers from human bias, leading to burnout for top performers and underutilization of others. Moreover, estimating task completion times is historically inaccurate. 

**FairSplit** solves this by leveraging **Machine Learning (XGBoost & Scikit-Learn)** to analyze historical performance and developer skills, intelligently predicting task duration and recommending the most equitable and efficient task allocations.

---

## ✨ Key Features & Technical Highlights

- 🧠 **AI-Driven Task Allocation**: Uses predictive modeling to suggest task assignments based on historical user velocity, skill matrix, and current workload.
- 📈 **Time-to-Completion Predictions**: Integrates **XGBoost** to forecast accurate deadlines, minimizing project overruns.
- 🔐 **Robust Security**: Fully authenticated API endpoints using **JWT (JSON Web Tokens)** with secure token refreshing.
- 📊 **Advanced Analytics Dashboard**: Real-time visualization of team health, project velocity, and resource distribution.
- 🏗️ **Scalable Architecture**: decoupled backend (Django REST Framework) and modern frontend (React/Vite) ensuring high performance and modularity.

---

## 🛠️ Technology Stack

### **Backend (Core & AI)**
- **Framework**: Django & Django REST Framework (DRF)
- **Database**: PostgreSQL (via `psycopg2`)
- **Machine Learning**: `xgboost`, `scikit-learn`, `pandas`, `numpy`
- **Security & Auth**: `djangorestframework-simplejwt`, `django-cors-headers`

### **Frontend (UI/UX)**
- **Framework**: React.js (Bootstrapped with Vite for instant HMR)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Code Quality**: ESLint

---

## 📂 Architecture & Directory Structure

```text
FairSplit/
├── backend/                   # 🐍 Django Backend (REST API)
│   ├── account/               # Custom user models & JWT auth
│   ├── allocation/            # Core logic for equitable task distribution
│   ├── prediction/            # ML inference endpoints (XGBoost/Scikit-Learn)
│   ├── analytics/             # Data aggregation for frontend dashboards
│   └── notifications/         # Real-time event broadcasting logic
│
└── frontend/                  # ⚛️ React Application
    ├── src/                   
    │   ├── assets/            # Static assets and images
    │   ├── components/        # Reusable UI components
    │   │   ├── common/        # Buttons, Inputs, Modals
    │   │   ├── layout/        # Navbar, Sidebar, Containers
    │   │   ├── dashboard/     # Dashboard specific components
    │   │   ├── project/       # Project specific components
    │   │   └── task/          # Task specific components
    │   ├── pages/             # Route-level components (Landing, Login, Dashboard, etc.)
    │   ├── App.jsx            # Main application router
    │   └── main.jsx           # React entry point
    └── package.json           # Frontend dependencies
```

---

## 📸 Sneak Peek
*(Add screenshots or a GIF here showcasing your amazing UI and ML predictions)*

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Dashboard+Preview" alt="FairSplit Dashboard">
</div>

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/PrakharPurwar12/FairSplit.git
cd FairSplit
```

### 2️⃣ Backend Environment Setup
```bash
cd backend
python -m venv myenv

# Activate Virtual Environment
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run Migrations & Start Server
python manage.py migrate
python manage.py runserver
```

### 3️⃣ Frontend Environment Setup
Open a new terminal tab/window:
```bash
cd frontend
npm install
npm run dev
```
> The frontend will typically be available at `http://localhost:5173/` and backend API at `http://localhost:8000/`.

---

## 🔮 Future Roadmap
- [ ] Integration with WebSockets (Django Channels) for real-time task updates.
- [ ] Automated retuning of ML models via Celery periodic tasks.
- [ ] GitHub/GitLab API integration for tracking commit metrics.

---

<div align="center">
  <b>Built with ❤️ by Prakhar Purwar</b>
</div>