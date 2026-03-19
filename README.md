# Jaxtina LMS - English Centre Management System

A production-ready Learning Management System built for English language centers, focusing on IELTS and TOEIC programs.

## 🚀 Tech Stack
- **Frontend**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **AI**: Claude API (Anthropic) for essay and speaking feedback

## 🛠 Setup Instructions

### 1. Supabase Preparation
1. Create a new project at [supabase.com](https://supabase.com).
2. Run the initial schema migration located in `supabase/migrations/20240319_initial_schema.sql` in the SQL Editor.
3. Enable Email Auth in your Supabase Dashboard (Authentication > Providers).

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-claude-api-key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

## 🏆 Core Features
- **Student Hub**: Personalized course tracking, lesson viewer, and activity submission.
- **Teacher Workspace**: Course creator, curriculum builder, and AI-assisted marking queue.
- **Admin Control**: Central management hub for staff, students, and centre analytics.
- **AI Feedback**: Automated essay scoring and speaking transcript analysis using Claude.

## 📦 Deployment (Vercel)
Connect your GitHub repository to Vercel and input the environment variables listed above. The build command is `npm run build`.

---
*Created with Antigravity for Jaxtina English Centre.*
