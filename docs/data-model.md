# Jaxtina LMS - Data Model

## Users & Profiles
- `auth.users` (Supabase Internal)
- `profiles`: Extends user data with roles (`student`, `teacher`, `admin`) and display info.

## Curriculum
- `courses`: High-level programs (e.g., IELTS Academic).
- `modules`: Units within a course.
- `lessons`: Individual pages of content (text, video links, PDFs).
- `activities`: Exercises attached to lessons (quizzes, essays, etc.).

## Classes & Enrolment
- `classes`: Specific instances of a course (e.g., "IELTS Night Class A").
- `class_enrolments`: Links students to classes.
- `class_teachers`: Links teachers to classes.

## Performance
- `submissions`: Student answers to activities.
- `scores` & `feedback`: Results of submissions.
- `ai_feedback_logs`: Logs of AI-generated initial feedback.
