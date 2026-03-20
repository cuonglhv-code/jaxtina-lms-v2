-- =============================================================
-- 04_auth_accounts.sql — Jaxtina LMS seed accounts
-- =============================================================
--
-- STEP 1: Create these 3 users manually in the Supabase dashboard:
--   Authentication → Users → "Add user" (tick "Auto Confirm User")
--
--   Email                     Password        Role
--   ─────────────────────     ──────────────  ───────────
--   cuonglhv@jaxtina.com      Jaxtina@123     super_admin
--   teacher@jaxtina.com       Jaxtina@123     teacher
--   student@jaxtina.com       Jaxtina@123     learner
--
-- STEP 2: Copy the UUID of each user from the dashboard.
--
-- STEP 3: Replace the placeholder UUIDs below with the real ones,
--         then run this script in the Supabase SQL editor.
-- =============================================================

INSERT INTO user_profiles (id, role, full_name, email, preferred_lang, created_at, updated_at)
VALUES
  (
    'REPLACE-ADMIN-UUID',
    'super_admin',
    'Cuong Le',
    'cuonglhv@jaxtina.com',
    'vi',
    NOW(),
    NOW()
  ),
  (
    'REPLACE-TEACHER-UUID',
    'teacher',
    'Jaxtina Teacher',
    'teacher@jaxtina.com',
    'vi',
    NOW(),
    NOW()
  ),
  (
    'REPLACE-STUDENT-UUID',
    'learner',
    'Demo Student',
    'student@jaxtina.com',
    'vi',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  role       = EXCLUDED.role,
  full_name  = EXCLUDED.full_name,
  updated_at = NOW();
