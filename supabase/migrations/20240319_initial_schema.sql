-- 20240319_initial_schema.sql
-- Initial schema for Jaxtina English Centre LMS
-- Aligned with production: user_profiles table, exact columns

-- ================================================================
-- 1. USER PROFILES
--    Extends Supabase Auth users with role, name, and contact info.
--    Uses CREATE TABLE IF NOT EXISTS because this table may already
--    exist in production (created manually).
-- ================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id             UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role           TEXT        NOT NULL DEFAULT 'learner',
  full_name      TEXT,
  display_name   TEXT,
  avatar_url     TEXT,
  phone          TEXT,
  email          TEXT,
  preferred_lang TEXT        DEFAULT 'vi',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Valid role values: super_admin | centre_admin | academic_admin | teacher | learner

-- ================================================================
-- 2. COURSES
--    Core learning programmes (IELTS, TOEIC, General English, etc.)
-- ================================================================
CREATE TABLE IF NOT EXISTS courses (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  exam_type     TEXT,          -- 'IELTS' | 'TOEIC' | 'General English'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 3. MODULES
--    Groups of lessons within a course.
-- ================================================================
CREATE TABLE IF NOT EXISTS modules (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID        REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  order_index INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 4. LESSONS
--    Individual content pages inside a module.
-- ================================================================
CREATE TABLE IF NOT EXISTS lessons (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID        REFERENCES modules(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  content     TEXT,          -- Markdown or JSON rich text
  video_url   TEXT,
  pdf_url     TEXT,
  order_index INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 5. CLASSES
--    A scheduled teaching instance of a course.
-- ================================================================
CREATE TABLE IF NOT EXISTS classes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID        REFERENCES courses(id) ON DELETE CASCADE,
  class_name  TEXT        NOT NULL,
  schedule    TEXT,          -- e.g. 'Mon/Wed 17:30'
  is_active   BOOLEAN     DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 6. CLASS ENROLMENTS
--    Links learners to the classes they attend.
-- ================================================================
CREATE TABLE IF NOT EXISTS class_enrolments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID        REFERENCES classes(id) ON DELETE CASCADE,
  student_id  UUID        REFERENCES user_profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (class_id, student_id)
);

-- ================================================================
-- 7. CLASS TEACHERS
--    Links teachers to the classes they teach.
-- ================================================================
CREATE TABLE IF NOT EXISTS class_teachers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID        REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id  UUID        REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (class_id, teacher_id)
);

-- ================================================================
-- 8. ACTIVITIES
--    Exercises and tests attached to lessons.
-- ================================================================
CREATE TABLE IF NOT EXISTS activities (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID        REFERENCES lessons(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  type         TEXT        NOT NULL,  -- 'quiz' | 'essay' | 'speaking' | 'reading' | 'listening'
  exam_target  TEXT,                  -- e.g. 'Writing Task 1'
  instructions TEXT,
  time_limit   INTEGER,               -- minutes
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 9. SUBMISSIONS
--    Student answers to activities.
-- ================================================================
CREATE TABLE IF NOT EXISTS submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID        REFERENCES activities(id) ON DELETE CASCADE,
  student_id  UUID        REFERENCES user_profiles(id) ON DELETE CASCADE,
  content     TEXT,
  file_url    TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 10. SCORES & FEEDBACK
--    Teacher marks and AI-assisted feedback on submissions.
-- ================================================================
CREATE TABLE IF NOT EXISTS scores (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID        REFERENCES submissions(id) ON DELETE CASCADE,
  teacher_id    UUID        REFERENCES user_profiles(id),
  score         NUMERIC,
  max_score     NUMERIC,
  marked_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID        REFERENCES submissions(id) ON DELETE CASCADE,
  teacher_id    UUID        REFERENCES user_profiles(id),
  content       TEXT,
  is_visible    BOOLEAN     DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 11. AI FEEDBACK LOGS
--    Isolated log of AI outputs (never directly visible to students).
-- ================================================================
CREATE TABLE IF NOT EXISTS ai_feedback_logs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID        REFERENCES submissions(id) ON DELETE CASCADE,
  prompt        TEXT,
  response      TEXT,
  model         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE user_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules          ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback_logs ENABLE ROW LEVEL SECURITY;

-- user_profiles: users read their own; admins read all
CREATE POLICY "Users read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins manage all profiles" ON user_profiles
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid())
    IN ('super_admin', 'centre_admin', 'academic_admin')
  );

-- Courses/modules/lessons: any authenticated user can read
CREATE POLICY "Authenticated users view courses"  ON courses  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users view modules"  ON modules  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users view lessons"  ON lessons  FOR SELECT TO authenticated USING (true);

-- Classes: only enrolled students, assigned teachers, or admins
CREATE POLICY "Class members can view classes" ON classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM class_enrolments WHERE class_id = classes.id AND student_id = auth.uid())
    OR EXISTS (SELECT 1 FROM class_teachers  WHERE class_id = classes.id AND teacher_id = auth.uid())
    OR (SELECT role FROM user_profiles WHERE id = auth.uid())
       IN ('super_admin', 'centre_admin', 'academic_admin')
  );

-- Submissions: students see their own; teachers/admins see all
CREATE POLICY "Students view own submissions" ON submissions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers view all submissions" ON submissions
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('teacher', 'super_admin', 'centre_admin', 'academic_admin')
  );

-- AI logs: admins only
CREATE POLICY "Admins view AI logs" ON ai_feedback_logs
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid())
    IN ('super_admin', 'centre_admin', 'academic_admin')
  );

-- ================================================================
-- TRIGGER: auto-create user_profiles row on new auth sign-up
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email, role, preferred_lang)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'learner'),
    COALESCE(new.raw_user_meta_data->>'preferred_lang', 'vi')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
