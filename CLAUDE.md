# LMS Project Context

## 1. Project Summary and Goals
A production-ready Learning Management System (LMS) for an English language teaching centre offering IELTS, TOEIC, and general English courses. Designed for three core roles: Students, Teachers, and Admins. The system manages courses, classes, exams, marking, and analytics while heavily integrating AI to draft feedback and generate content.

## 2. Tech Stack and Architecture
- **Frontend & API**: Next.js (App Router) with TypeScript, strictly using Server Components and Route Handlers for API endpoints.
- **Styling**: Tailwind CSS + a modern UI component library (e.g., shadcn/ui).
- **Backend/Database**: Supabase (Postgres Database, Auth, Storage, and Row Level Security).
- **Hosting**: Vercel (Next.js) and Supabase Cloud (DB/Auth/Storage).
- **AI**: Server-side integrations using external AI models (configured via `.env.local`).

## 3. Roles and Core User Flows
- **Student**: Sign up/in, enroll in courses, access lessons/materials, complete activities (multiple choice, file/audio uploads), view scores/AI-assisted feedback, and track progress via dashboards.
- **Teacher**: Create/manage courses and materials, build exams, mark submissions, utilize AI for draft feedback (reviewing and editing before student visibility), and monitor class performance.
- **Admin**: Manage all users, course catalogs, and class schedules. View centre-wide live analytics (total students, enrolments, teacher workloads, cohort trends).

## 4. Core Data Model (High-Level)
- `users` (Auth) & `profiles`: Roles (student/teacher/admin) and personal info.
- `courses` → `modules` → `lessons`: Curriculum structure.
- `classes`: Links students (`class_enrolments`), teachers (`class_teachers`), and courses.
- `activities` & `questions`: Quizzes, essays, speaking tasks.
- `submissions`, `scores`, & `feedback`: Student answers and teacher grading.
- `ai_feedback_logs`: Securely isolated logs of AI outputs and metadata.

## 5. AI Features (Server-Side Only)
1. **Essay Feedback**: Suggests bands, breaks down criteria, and offers actionable tips.
2. **Speaking Feedback**: Analyzes transcripts/audio for fluency, grammar, and pronunciation.
3. **Content Assistant**: Generates practice questions, model answers, and lesson ideas for teachers.

## 6. Dashboards
- **Student**: Task deadlines, score summaries, and progress graphs (by skill).
- **Teacher**: Marking queues, class summaries, and struggling student alerts.
- **Admin**: Centre-wide metrics, active users, course popularity, and performance trends.

## 7. Conventions for Claude Code
- **Plan-First**: Always outline changes in plain English and wait for user approval before writing code, creating files, or running commands.
- **Small, Safe Steps**: Use explicit commands and explain what each does. Use Supabase migrations for schema changes, never ad-hoc SQL.
- **Context Awareness**: Rely on this `CLAUDE.md` file as the primary source of truth. If scope or architecture changes, update this file and notify the project owner.
- **Non-Technical Explanations**: The project owner does not write code. Explain all technical concepts and next steps in plain, simple English.
