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
    'a3ab1cd9-59a1-4138-990c-e6a5207758c5',
    'super_admin',
    'Cuong Le',
    'cuonglhv@jaxtina.com',
    'vi',
    NOW(),
    NOW()
  ),
  (
    'f505202a-2b71-4a76-9ac8-e0a6afdab149',
    'teacher',
    'Jaxtina Teacher',
    'teacher@jaxtina.com',
    'vi',
    NOW(),
    NOW()
  ),
  (
    '5ae26ec8-5512-4d84-82a5-a7e2c9ed992e',
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
