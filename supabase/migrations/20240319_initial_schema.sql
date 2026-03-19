-- 20240319_initial_schema.sql
-- Initial schema for English Centre LMS (Students, Teachers, Admins)

-- 1. PROFILES: Extend Supabase Auth users with roles and custom info
CREATE TYPE app_role AS ENUM ('student', 'teacher', 'admin');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role app_role DEFAULT 'student',
  avatar_url TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES: Core learning programs (IELTS, TOEIC, etc.)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  exam_type TEXT, -- 'IELTS', 'TOEIC', 'General English', etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MODULES: Grouping for lessons within a course
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSONS: Individual pages of content
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Markdown or JSON for rich text
  video_url TEXT,
  pdf_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLASSES: A specific teaching instance of a course
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  schedule TEXT, -- e.g., 'Mon/Wed 17:30'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLASS ENROLMENTS: Which students are in which class
CREATE TABLE class_enrolments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- 7. CLASS TEACHERS: Which teachers are assigned to a class
CREATE TABLE class_teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, teacher_id)
);

-- 8. ACTIVITIES: Exercises/Tests linked to lessons
CREATE TYPE activity_type AS ENUM ('quiz', 'essay', 'speaking', 'reading', 'listening');

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type activity_type NOT NULL,
  exam_target TEXT, -- e.g., 'Writing Task 1'
  instructions TEXT,
  time_limit INTEGER, -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SECURITY: ROW LEVEL SECURITY (RLS) policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can reading their own, Admins can read all
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 2. Courses/Modules/Lessons: Public for read, Admins/Teachers can manage
CREATE POLICY "Anyone logged in can view course materials" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone logged in can view modules" ON modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone logged in can view lessons" ON lessons FOR SELECT TO authenticated USING (true);

-- 3. Classes: Only participants (students/teachers) or admins can see
CREATE POLICY "Members can view their classes" ON classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM class_enrolments WHERE class_id = id AND student_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM class_teachers WHERE class_id = id AND teacher_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Helper trigger for automatic profile creation when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
