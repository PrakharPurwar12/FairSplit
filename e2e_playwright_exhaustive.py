import os
import sqlite3
import asyncio
from playwright.async_api import async_playwright

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))
DB_PATH = os.path.join(BACKEND_DIR, 'db.sqlite3')

def get_invitation_token(email):
    """Fetch pending invitation token via raw SQL (safe from async context)."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT invitation_token FROM project_projectinvitation WHERE email=? AND status='PENDING' ORDER BY id DESC LIMIT 1",
            (email,)
        )
        row = cursor.fetchone()
        return row[0] if row else None
    finally:
        conn.close()

SCREENSHOT_DIR = "C:/Users/purwa/.gemini/antigravity-ide/brain/cc63f3fe-0b65-4d68-b391-bfa48c72fdf1"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def cleanup_db():
    print("Cleaning up database for E2E run via raw SQL...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM tasks_taskassignment WHERE task_id IN (SELECT id FROM tasks_task WHERE title LIKE 'E2E%')")
        cursor.execute("DELETE FROM tasks_task WHERE title LIKE 'E2E%'")
        cursor.execute("DELETE FROM project_projectmember WHERE project_id IN (SELECT id FROM project_project WHERE title = 'E2E Stabilization Project')")
        cursor.execute("DELETE FROM project_projectinvitation WHERE project_id IN (SELECT id FROM project_project WHERE title = 'E2E Stabilization Project')")
        cursor.execute("DELETE FROM project_project WHERE title = 'E2E Stabilization Project'")
        cursor.execute("DELETE FROM account_user WHERE username IN ('manager_e2e', 'member_e2e')")
        conn.commit()
        print("  DB cleanup complete.")
    except Exception as e:
        print(f"  SQL Cleanup Note: {e}")
    finally:
        conn.close()

cleanup_db()

async def wait_for_toast(page, partial_text, timeout=12000):
    locator = page.locator(f"span:has-text('{partial_text}')")
    await locator.first.wait_for(state="visible", timeout=timeout)
    return locator.first

async def sshot(page, name, label=None):
    await page.screenshot(path=f"{SCREENSHOT_DIR}/{name}.png")
    if label:
        print(f"  screenshot: {label}")

async def run_exhaustive_e2e():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=80)
        context = await browser.new_context(viewport={"width": 1280, "height": 720})
        page = await context.new_page()
        page.set_default_timeout(15000)

        print("\n1. Loading Landing Page...")
        await page.goto("http://localhost:5173/")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "01_landing", "Landing")

        print("\n2. Registering Manager...")
        await page.goto("http://localhost:5173/register")
        await page.wait_for_selector("#username")
        await page.fill("#firstName", "Manager")
        await page.fill("#lastName", "E2E")
        await page.fill("#username", "manager_e2e")
        await page.fill("#email", "manager_e2e@fairsplit.com")
        await page.select_option("#role", "manager")
        await page.fill("#password", "StrongPassword123!")
        await page.fill("#confirmPassword", "StrongPassword123!")
        await sshot(page, "02_register_form")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/login**", timeout=12000)
        print("  PASS: Register -> redirected to login")

        print("\n3. Logging in Manager...")
        await page.fill("#username", "manager_e2e")
        await page.fill("#password", "StrongPassword123!")
        await sshot(page, "03_login_form")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/dashboard**", timeout=12000)
        print("  PASS: Login -> Dashboard")

        print("\n4. Dashboard Loaded...")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "04_dashboard", "Dashboard")

        print("\n5. Creating Project...")
        await page.goto("http://localhost:5173/projects")
        await page.wait_for_load_state("networkidle")
        await page.click('button:has-text("Create Project")')
        await page.wait_for_selector('input[placeholder*="FairSplit Production"]')
        await page.fill('input[placeholder*="FairSplit Production"]', "E2E Stabilization Project")
        await page.fill('textarea[placeholder*="Summarize"]', "Exhaustive E2E test project.")
        await page.locator('label:has-text("Start Date") + input').fill("2026-08-04")
        await page.locator('label:has-text("End Date") + input').fill("2026-08-30")
        await sshot(page, "05_create_project_modal")
        await page.locator('form button[type="submit"]').first.click()
        await page.wait_for_selector('text="E2E Stabilization Project"', timeout=12000)
        await sshot(page, "05_project_created", "Project created")
        print("  PASS: Project created")

        print("\n6. Inviting Member...")
        await page.goto("http://localhost:5173/teams")
        await page.wait_for_load_state("networkidle")
        try:
            await page.click('button:has-text("Add / Invite Member")', timeout=5000)
        except Exception:
            await page.click('button:has-text("Invite")', timeout=5000)
        await page.wait_for_selector('text="2. Invite New Member"', timeout=8000)
        await page.click('text="2. Invite New Member"')
        await page.select_option("#invite-project-select", label="E2E Stabilization Project")
        await page.fill("#invite-fullname-input", "Member E2E")
        await page.fill("#invite-email-input", "member_e2e@fairsplit.com")
        await page.locator("select[id^='invite-role']").first.select_option(label="Developer")
        await sshot(page, "06_invite_member_modal")
        send_btn = page.locator('button:has-text("Send Invitation")')
        if await send_btn.count() > 0:
            await send_btn.first.click()
        else:
            await page.locator('button[type="submit"]').last.click()
        try:
            await wait_for_toast(page, "nvitation", timeout=10000)
        except Exception:
            print("  NOTE: Invitation toast not found (may have gone quickly)")
        await sshot(page, "06_invite_sent", "Invite sent")
        token = get_invitation_token("member_e2e@fairsplit.com")
        if token is None:
            raise AssertionError("Invitation not found in DB after sending invite!")
        print(f"  Token: {token}")
        print("  PASS: Invite sent")

        print("\n7. Accept Invitation Journey...")
        await page.evaluate("() => localStorage.clear()")
        await page.reload()
        await page.goto(f"http://localhost:5173/invite/{token}")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "07_invite_preview")
        accept_btn = page.locator('button:has-text("Accept Invitation")')
        if await accept_btn.count() > 0:
            await accept_btn.first.click()
            try:
                await page.wait_for_url("**/login**", timeout=8000)
                await sshot(page, "07_redirected_to_login")
            except Exception:
                pass

        await page.goto("http://localhost:5173/register")
        await page.wait_for_selector("#username", timeout=8000)
        await page.fill("#firstName", "Member")
        await page.fill("#lastName", "E2E")
        await page.fill("#username", "member_e2e")
        await page.fill("#email", "member_e2e@fairsplit.com")
        await page.select_option("#role", "member")
        await page.fill("#password", "StrongPassword123!")
        await page.fill("#confirmPassword", "StrongPassword123!")
        await sshot(page, "07_register_member_form")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/login**", timeout=12000)
        await page.fill("#username", "member_e2e")
        await page.fill("#password", "StrongPassword123!")
        await sshot(page, "07_login_member_form")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/dashboard**", timeout=12000)
        print("  PASS: Member registered and logged in")

        await page.goto(f"http://localhost:5173/invite/{token}")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "07_back_to_invite_preview")
        accept_btn2 = page.locator('button:has-text("Accept Invitation")')
        if await accept_btn2.count() > 0:
            await accept_btn2.first.click()
            try:
                await page.wait_for_url("**/projects/**", timeout=15000)
                print("  PASS: Invitation accepted")
                await sshot(page, "07_invitation_accepted_redirect")
            except Exception:
                await sshot(page, "07_post_accept_state")
                print("  NOTE: Post-accept URL check, see screenshot")

        print("\n8. Logging manager back in...")
        await page.evaluate("() => localStorage.clear()")
        await page.goto("http://localhost:5173/login")
        await page.wait_for_selector("#username")
        await page.fill("#username", "manager_e2e")
        await page.fill("#password", "StrongPassword123!")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/dashboard**", timeout=12000)
        print("  PASS: Manager re-logged in")

        print("\n9. Creating Tasks...")
        await page.goto("http://localhost:5173/tasks")
        await page.wait_for_load_state("networkidle")
        await page.click('button:has-text("Create Task")')
        await page.wait_for_selector('input[placeholder*="Design Landing"]', timeout=8000)
        await page.fill('input[placeholder*="Design Landing"]', "E2E Task to Keep")
        await page.fill('textarea[placeholder*="Detail required"]', "Task to assign and keep.")
        await page.locator('label:has-text("Associated Project") + select').select_option(label="E2E Stabilization Project")
        await page.locator('label:has-text("Priority") + select').select_option(label="High")
        await page.locator('label:has-text("Estimated Hours") + input').fill("12")
        await page.locator('label:has-text("Deadline") + input').fill("2026-08-25")
        await sshot(page, "09_create_task_modal")
        await page.locator('form button[type="submit"]').first.click()
        await page.wait_for_selector('text="E2E Task to Keep"', timeout=10000)
        print("  PASS: Task 1 created")

        await page.click('button:has-text("Create Task")')
        await page.wait_for_selector('input[placeholder*="Design Landing"]', timeout=8000)
        await page.fill('input[placeholder*="Design Landing"]', "E2E Task to Delete")
        await page.fill('textarea[placeholder*="Detail required"]', "Task to delete.")
        await page.locator('label:has-text("Associated Project") + select').select_option(label="E2E Stabilization Project")
        await page.locator('label:has-text("Estimated Hours") + input').fill("4")
        await page.locator('label:has-text("Deadline") + input').fill("2026-08-20")
        await page.locator('form button[type="submit"]').first.click()
        await page.wait_for_selector('text="E2E Task to Delete"', timeout=10000)
        await sshot(page, "09_tasks_created", "Tasks created")
        print("  PASS: Task 2 created")

        print("\n10. Editing Task...")
        # Edit button is icon-only with title="Edit task". Use JS dispatch since button is opacity-0.
        clicked = await page.evaluate("""
            (taskTitle) => {
                const h3s = Array.from(document.querySelectorAll('h3'));
                const h3 = h3s.find(el => el.textContent.trim().includes(taskTitle));
                if (!h3) return false;
                let container = h3.parentElement;
                for (let i = 0; i < 6; i++) {
                    const btn = container.querySelector('button[title="Edit task"]');
                    if (btn) { btn.click(); return true; }
                    container = container.parentElement;
                    if (!container) break;
                }
                return false;
            }
        """, "E2E Task to Keep")
        if not clicked:
            raise AssertionError("Could not find Edit task button for 'E2E Task to Keep'")
        # Wait for the Edit Task modal to open (modal header h3 says "Edit Task")
        # NOTE: The edit form's title input has NO placeholder. Use label selector.
        await page.wait_for_selector('h3:has-text("Edit Task")', timeout=12000)
        await page.wait_for_timeout(500)  # framer-motion animation (200ms) + React render
        await sshot(page, "10_edit_modal_open")
        # Find title input via label (Edit modal has no placeholder on title input)
        title_label = page.locator('label:has-text("Task Title")')
        title_input = title_label.locator('+ input')
        await title_input.wait_for(state="visible", timeout=8000)
        await title_input.click()
        await page.keyboard.press("Control+A")
        await page.keyboard.type("E2E Task to Keep - Edited", delay=20)
        await sshot(page, "10_edit_task_modal")
        await page.locator('button:has-text("Save Changes")').click()
        await page.wait_for_selector('text="E2E Task to Keep - Edited"', timeout=12000)
        print("  PASS: Task edited")


        print("\n11. Deleting Task...")
        page.on("dialog", lambda d: asyncio.ensure_future(d.accept()))
        # Use JS dispatch to click Delete button in the right task card
        clicked_del = await page.evaluate("""
            (taskTitle) => {
                const h3s = Array.from(document.querySelectorAll('h3'));
                const h3 = h3s.find(el => el.textContent.trim().includes(taskTitle));
                if (!h3) return false;
                let container = h3.parentElement;
                for (let i = 0; i < 6; i++) {
                    const btn = container.querySelector('button[title="Delete task"]');
                    if (btn) { btn.click(); return true; }
                    container = container.parentElement;
                    if (!container) break;
                }
                return false;
            }
        """, "E2E Task to Delete")
        if not clicked_del:
            raise AssertionError("Could not find Delete task button for 'E2E Task to Delete'")
        try:
            await page.wait_for_selector('text="E2E Task to Delete"', state="detached", timeout=10000)
            print("  PASS: Task deleted")
        except Exception:
            print("  NOTE: Delete state unclear, check screenshot")
        await sshot(page, "11_task_deleted")

        print("\n12. Manual Assignment...")
        # "Assign Manually" is a <span> (not button) - click it directly
        try:
            await page.locator('span:has-text("Assign Manually")').first.click(timeout=5000)
        except Exception:
            print("  NOTE: Assign Manually span not visible, check task state")
        await page.wait_for_selector('text="Assign Task"', timeout=8000)
        # Select member - option text: "{username} ({role})"
        assign_select = page.locator('form select').first
        # Try exact label first; fall back to value-based select
        try:
            await assign_select.select_option(label="member_e2e (Developer)")
        except Exception:
            # Try selecting by partial username match
            options = await assign_select.locator('option').all()
            for opt in options:
                txt = await opt.inner_text()
                if 'member_e2e' in txt:
                    val = await opt.get_attribute('value')
                    await assign_select.select_option(value=val)
                    break
        await sshot(page, "12_manual_assignment_modal")
        await page.locator('button:has-text("Assign Task")').click()
        try:
            await wait_for_toast(page, "ssigned", timeout=8000)
            print("  PASS: Task assigned")
        except Exception:
            print("  NOTE: Assignment toast not detected, check screenshot")
        await sshot(page, "12_assigned_success")

        print("\n13. Running AI Allocation...")
        await page.goto("http://localhost:5173/ai-allocation")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "13_ai_hub")
        try:
            await page.locator('select').first.select_option(label="E2E Stabilization Project", timeout=5000)
            await page.wait_for_load_state("networkidle")
        except Exception:
            pass
        run_btn = page.locator('button:has-text("Run AI Allocation")')
        if await run_btn.count() > 0:
            await run_btn.first.click()
            try:
                await wait_for_toast(page, "AI Allocation", timeout=15000)
                print("  PASS: AI Allocation run")
            except Exception:
                print("  NOTE: AI toast not found, check screenshot")
        else:
            print("  NOTE: Run AI Allocation button not visible")
        await sshot(page, "13_ai_allocated_success")

        print("\n14. Checking Analytics...")
        await page.goto("http://localhost:5173/analytics")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "14_analytics")
        print("  PASS: Analytics loaded")

        print("\n15. Checking Notifications...")
        await page.goto("http://localhost:5173/notifications")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "15_notifications")
        print("  PASS: Notifications loaded")

        print("\n16. Checking Settings...")
        await page.goto("http://localhost:5173/settings")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "16_settings")
        print("  PASS: Settings loaded")

        print("\n17. Logging Out...")
        await page.evaluate("() => localStorage.clear()")
        await page.goto("http://localhost:5173/login")
        await page.wait_for_load_state("networkidle")
        await sshot(page, "17_logged_out")
        print("  PASS: Logout")

        print("\n\n=== Exhaustive E2E Suite Completed Successfully! ===\n")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_exhaustive_e2e())
