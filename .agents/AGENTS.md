# Frontend Project Rules

**Highest Priority Rule:** KEEP EVERYTHING SIMPLE. Do NOT over-engineer anything. Always prefer the simplest clean solution. Follow the KISS Principle.

**Project Structure:**
src/
  assets/
  components/
    common/
    layout/
    dashboard/
    project/
    task/
  pages/
    Login.jsx, Register.jsx, Dashboard.jsx, Projects.jsx, ProjectDetails.jsx, Tasks.jsx, Analytics.jsx, Prediction.jsx, Notifications.jsx, Profile.jsx, Settings.jsx
  App.jsx, main.jsx, index.css

Do NOT create additional folders like hooks, store, redux, zustand, services, helpers, constants, utils, config unless explicitly asked.

**Component Strategy:**
Create a reusable component ONLY IF it will be used in at least two different places. Otherwise keep the code inside the page.

**UI Strategy:**
Design first, code second. Before writing any React code, explain:
1. Why the component exists.
2. What information it should display.
3. What the user should be able to do.
4. How it fits into the overall application.

**Design Philosophy:**
Look like a real SaaS application (Linear, GitHub, Notion, Jira, Stripe Dashboard). Avoid futuristic AI looks, flashy gradients, glassmorphism, neon colors, oversized animations.

**Styling:**
Use React, Vite, Tailwind CSS, Shadcn/UI (only when needed), Lucide React Icons. Do not introduce other UI libraries without permission.

**State Management:**
Keep state local. Do NOT introduce Redux, Zustand, or Context API unless absolutely necessary.

**API Strategy:**
Use dummy/static data for now. Do NOT redesign components because of backend integration.

**Coding Style:**
Write clean React code, readable variables/folders/components. No unnecessary comments, no clever tricks, no advanced patterns.

**Explanation Rule:**
After implementation explain:
Why this approach was chosen, why it is better than complex alternatives, and how it will integrate with the backend later.

**Important Restrictions:**
No redesigning architecture, no new folders/naming conventions, no rewriting previously written code without explicit permission.

**Workflow:**
Step 1: Explain the UI -> Step 2: Design the layout -> Step 3: Break into components (if necessary) -> Step 4: Write React code -> Step 5: Explain the code -> Step 6: Wait for approval.
Never implement multiple pages at once.

**Final Rule:**
When tempted to make things complex, STOP. Choose the simple solution. If a new library/architecture is needed, explain why (pros/cons) and wait for approval.
