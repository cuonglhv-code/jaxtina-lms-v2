-- 06_fix_rls_final.sql
-- Drops all existing policies on user_profiles and recreates them
-- with simple, non-recursive rules to eliminate infinite recursion.

-- Step 1: Drop every existing policy on user_profiles
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'user_profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', pol.policyname);
  END LOOP;
END
$$;

-- Step 2: Enable RLS (safe to run even if already enabled)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Simple own-row policies — no subqueries, no recursion

-- Users can read their own row
CREATE POLICY select_own
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own row (registration)
CREATE POLICY insert_own
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own row
CREATE POLICY update_own
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role bypasses RLS entirely (Supabase default behaviour,
-- but explicit grant here for clarity)
CREATE POLICY service_role_all
  ON user_profiles FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
