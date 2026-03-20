export type UserRole = 'super_admin' | 'centre_admin' | 'academic_admin' | 'teacher' | 'learner';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  exam_type: string; // 'IELTS' | 'TOEIC' | 'General English' | 'Business English'
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content?: string;
  video_url?: string;
  pdf_url?: string;
  order_index: number;
  created_at: string;
}

export interface Class {
  id: string;
  course_id: string;
  class_name: string;
  schedule?: string;
  is_active: boolean;
  created_at: string;
}

export interface ClassEnrolment {
  id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
}

export interface ClassTeacher {
  id: string;
  class_id: string;
  teacher_id: string;
  assigned_at: string;
}

export type ActivityType = 'quiz' | 'essay' | 'speaking' | 'reading' | 'listening';

export interface Activity {
  id: string;
  lesson_id: string;
  title: string;
  type: ActivityType;
  exam_target?: string;
  instructions?: string;
  time_limit?: number;
  created_at: string;
}

export interface Submission {
  id: string;
  activity_id: string;
  student_id: string;
  status: 'draft' | 'submitted' | 'under_review' | 'graded';
  content?: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  teacher_id?: string;
  submitted_at: string;
  graded_at?: string;
}

export interface AIFeedbackLog {
  id: string;
  submission_id: string;
  prompt: string;
  response: string;
  model: string;
  created_at: string;
}
