-- Add teacher_id, scheduling and capacity columns to the existing classes table
ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS teacher_id   UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS start_date   DATE,
  ADD COLUMN IF NOT EXISTS end_date     DATE,
  ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS status       TEXT DEFAULT 'active';

-- Add status check constraint (safe to add separately)
DO $$
BEGIN
  ALTER TABLE classes
    ADD CONSTRAINT classes_status_check
    CHECK (status IN ('active', 'completed', 'cancelled'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- RLS: admins full access on classes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'classes' AND policyname = 'admins_all_classes'
  ) THEN
    CREATE POLICY "admins_all_classes" ON classes FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE id = auth.uid()
            AND role IN ('super_admin', 'centre_admin', 'academic_admin')
        )
      );
  END IF;
END
$$;

-- RLS: teachers can select classes they're assigned to
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'classes' AND policyname = 'teachers_select_own_classes'
  ) THEN
    CREATE POLICY "teachers_select_own_classes" ON classes FOR SELECT
      USING (teacher_id = auth.uid());
  END IF;
END
$$;
