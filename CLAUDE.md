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

## 4. Core Data Model

### `user_profiles` (production table — exact columns)
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | References `auth.users(id)` |
| `role` | TEXT | `super_admin` · `centre_admin` · `academic_admin` · `teacher` · `learner` |
| `full_name` | TEXT | |
| `display_name` | TEXT | Optional display alias |
| `avatar_url` | TEXT | |
| `phone` | TEXT | |
| `email` | TEXT | |
| `preferred_lang` | TEXT | Default `'vi'` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

> **Important:** Always query `user_profiles`, never `profiles`. Role values are text strings, not an enum.

### Other tables
- `courses` → `modules` → `lessons`: Curriculum structure.
- `classes`: Scheduled instances of a course.
- `class_enrolments`: Links learners to classes.
- `class_teachers`: Links teachers to classes.
- `activities`: Quizzes, essays, speaking tasks linked to lessons.
- `submissions`: Student answers to activities.
- `scores` & `feedback`: Teacher marks and written feedback.
- `ai_feedback_logs`: Isolated AI output log, never visible to students directly.

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

## 8. Dashboard implementation task
Here’s a Claude-ready prompt you can paste into `CLAUDE.md` or a new build file (e.g. `build_dashboards.txt`) to integrate all the dashboard code we designed.

```text
You are an expert Next.js 15 + Supabase + Tailwind/shadcn engineer working in this repo:

https://github.com/cuonglhv-code/jaxtina-lms-v2

Goal: Implement learner, admin, and teacher dashboards using the shared design system and Supabase auth/profile data.

IMPORTANT:
- Read CLAUDE.md fully before editing.
- Follow the existing project patterns in src/app, src/lib, src/components.
- Keep all changes inside src/** and supabase/** only.
- Do NOT change middleware, auth callback logic, or existing auth pages.

────────────────────────────────
STEP 1 — DESIGN SYSTEM UPDATE
────────────────────────────────

1) Open src/app/globals.css.
   After the Tailwind @import lines, add this :root block (do not duplicate if already present):

:root {
  --midnight: #0D1B2A;
  --ocean: #1B4F72;
  --jade: #0E9F6E;
  --jade-light: rgba(14,159,110,0.1);
  --sand: #F5F0E8;
  --chalk: #FAFAF8;
  --ink: #1A1A2E;
  --mist: #8892A4;
  --border: #E2DDD6;
  --card-shadow: 0 2px 24px rgba(13,27,42,0.07);
  --sidebar-width: 240px;
}

2) Keep typography consistent with the auth layout:
   - Display: 'Instrument Serif'
   - Body: 'DM Sans'

Do NOT change the font setup in the root layout, just rely on the existing configuration.

────────────────────────────────
STEP 2 — SHARED SUPABASE CLIENTS
────────────────────────────────

Use the existing Supabase helpers:

- src/lib/supabase/server.ts
- src/lib/supabase/client.ts

Do NOT change these files except for imports if absolutely necessary. Continue to use:

- createClient() on the server from src/lib/supabase/server
- createClient() on the client from src/lib/supabase/client

The main profile table is called profiles, not user_profiles.

Confirm columns from supabase/migrations/20240319_initial_schema.sql:

Table: profiles
Columns (only use these fields):
- id UUID PRIMARY KEY
- full_name TEXT
- role TEXT
- avatar_url TEXT
- phone_number TEXT
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Never reference non-existent columns like email, preferred_lang, display_name, etc. Email comes from auth.users and should NOT be queried directly here.

────────────────────────────────
STEP 3 — SHARED UI COMPONENTS
────────────────────────────────

Create these new files (or update if they already exist) under src/components.

3.1) Avatar component
File: src/components/ui/Avatar.tsx

Requirements:
- Client component: must start with 'use client'
- Props: { name: string; size?: 'sm' | 'md' | 'lg'; imageUrl?: string | null }
- Shows user avatar; if imageUrl missing, show initials (first + last name initials).
- Background color derived deterministically from the name string (hash -> HSL).
- Sizes:
  - sm: h-8 w-8 text-xs
  - md: h-10 w-10 text-sm
  - lg: h-12 w-12 text-base

Implement exactly:

```tsx
'use client'

import * as React from 'react'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  name: string
  imageUrl?: string | null
  size?: AvatarSize
}

function getInitials(name: string) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  const initials =
    parts.length === 1
      ? parts
      : `${parts[0][0]}${parts[parts.length - 1][0]}`
  return initials.toUpperCase()
}

function stringToColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 60%, 55%)`
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function Avatar({ name, imageUrl, size = 'md' }: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = stringToColor(name || 'User')

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full text-white font-medium ${sizeMap[size]}`}
      style={{ backgroundColor: bgColor }}
      aria-label={name}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  )
}
```

3.2) StatCard
File: src/components/layout/StatCard.tsx

Requirements:
- Props: { icon: LucideIcon; iconBg: string; value: string | number; label: string; trend?: 'up' | 'down'; trendValue?: string }
- Card style:
  - rounded-2xl
  - border-[var(--border)]
  - bg-white
  - shadow-[var(--card-shadow)]
  - padding 24px

Use this implementation:

```tsx
import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  iconBg: string
  value: string | number
  label: string
  trend?: 'up' | 'down'
  trendValue?: string
}

export function StatCard({
  icon: Icon,
  iconBg,
  value,
  label,
  trend,
  trendValue,
}: StatCardProps) {
  const trendColor =
    trend === 'up' ? 'bg-emerald-100 text-emerald-700' : trend === 'down' ? 'bg-red-100 text-red-700' : ''
  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--card-shadow)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className="inline-flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend && trendValue && (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendColor}`}
          >
            <span>{trendSymbol}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-['Instrument_Serif'] text-4xl text-[var(--ink)]">
          {value}
        </div>
        <div className="text-[13px] font-normal tracking-wide text-[var(--mist)] uppercase">
          {label}
        </div>
      </div>
    </div>
  )
}
```

3.3) DashboardShell
File: src/components/layout/DashboardShell.tsx

Client component that renders:
- Fixed left sidebar on desktop
- Mobile top bar with hamburger menu
- Sidebar:
  - Jaxtina “J” logomark + wordmark
  - Nav items with active state using usePathname()
  - Bottom area with Avatar + full_name + role badge + logout button

Props:
- navItems: { label: string; href: string; icon: LucideIcon }[]
- userProfile: { full_name: string; role: string; email: string; avatar_url?: string | null }
- children: React.ReactNode

Implement exactly:

```tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { Menu, LogOut } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface UserProfile {
  full_name: string
  role: string
  email: string
  avatar_url?: string | null
}

interface DashboardShellProps {
  navItems: NavItem[]
  userProfile: UserProfile
  children: React.ReactNode
}

export function DashboardShell({
  navItems,
  userProfile,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const roleLabel =
    userProfile.role === 'admin'
      ? 'Admin'
      : userProfile.role === 'teacher'
      ? 'Teacher'
      : 'Learner'

  return (
    <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--chalk)]"
        >
          <Menu className="h-5 w-5 text-[var(--ink)]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--jade)] text-lg font-semibold text-white">
            J
          </div>
          <span className="font-['Instrument_Serif'] text-lg text-[var(--midnight)]">
            Jaxtina
          </span>
        </div>
        <Avatar name={userProfile.full_name} size="sm" imageUrl={userProfile.avatar_url} />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-[var(--sidebar-width)] transform bg-[var(--midnight)] text-white transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-4 py-5">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--jade)] text-xl font-semibold text-white">
                J
              </div>
              <span className="font-['Instrument_Serif'] text-xl">
                Jaxtina
              </span>
            </div>

            <nav className="space-y-1 text-sm font-normal">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      isActive
                        ? 'border-l-4 border-[var(--jade)] bg-[var(--jade-light)] text-[var(--jade)]'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-[14px]">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  name={userProfile.full_name}
                  size="sm"
                  imageUrl={userProfile.avatar_url}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userProfile.full_name}
                  </span>
                  <span className="mt-1 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">
                    {roleLabel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/logout'
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-[var(--sidebar-width)]">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
```

────────────────────────────────
STEP 4 — LEARNER DASHBOARD
────────────────────────────────

Create file:
- src/app/learner/dashboard/page.tsx (server component)

Requirements:
- Use Supabase server client and cookies to get session.
- If no session → redirect('/login').
- Fetch profile from profiles where id = session.user.id.
- If role is not 'student' → redirect('/login') or appropriate route.
- Use DashboardShell with learner nav items.
- Header: “Good morning, [first_name] 👋” and subtitle “Here’s your learning overview”.
- Stat cards using StatCard with icons:
  - Current Band (Target, value from session.user.user_metadata.current_band or '—').
  - Target Band (Trophy, target_band or '—').
  - Lessons Completed (CheckCircle, 0).
  - Practice Essays (FileText, 0).
- Layout:
  - Two-column grid (3:1) with My Courses + Recent Activity on the left, Upcoming + Quick Practice + Learning Streak on the right.
  - Implement the empty-state and skeleton UIs as described in the original instructions.

Use the full implementation from the earlier answer (copy it verbatim), adjusting imports if your alias is different from '@/...'.

────────────────────────────────
STEP 5 — ADMIN DASHBOARD
────────────────────────────────

Create file:
- src/app/admin/dashboard/page.tsx (server component)

Requirements:
- Use Supabase server client.
- If no session → redirect('/login').
- Load profile from profiles; only allow role 'admin'.
  - If role is not 'admin' → redirect('/learner/dashboard').
- Stats:
  - Total Learners: count profiles where role = 'student'.
  - Total Teachers: count profiles where role = 'teacher'.
  - Total Courses: count from courses table if exists, else show '—' (handle error from Supabase).
  - This Month: number of profiles where role='student' and created_at >= first day of current month.
- Recent Registrations:
  - Fetch last 10 profiles ordered by created_at DESC.
  - Table columns: Name (Avatar + full_name), Email (use '—' placeholder, since email isn’t on profiles), Role (badge), Joined (formatted date).
- Quick Actions:
  - Four clickable cards linking to /admin/courses/new, /admin/classes/new, /admin/analytics, /admin/teachers, matching the design described.
- Right column:
  - System Status card with 3 green rows (Database, AI Scoring, Auth).
  - User Breakdown card:
    - Count profiles by role (student, teacher, admin) and show horizontal bars with proportional width.
  - Platform Info card: “Jaxtina EduOS v1.0”, deployed today’s date, stack text.

Use the detailed implementation from the earlier answer and ensure all imports resolve and only valid columns from profiles are used.

────────────────────────────────
STEP 6 — TEACHER DASHBOARD
────────────────────────────────

Create file:
- src/app/teacher/dashboard/page.tsx (server component)

Requirements:
- Use Supabase server client.
- If no session → redirect('/login').
- Load profile from profiles; only allow role 'teacher':
  - If role !== 'teacher' → redirect('/learner/dashboard').
- Header: “Welcome, [first_name]” and subtitle “Teacher Dashboard — Jaxtina English Centre”.
- Stat cards (placeholders, all “0”):
  - My Classes (Users icon).
  - My Learners (GraduationCap).
  - Pending Reviews (Clock).
  - Reviewed Today (CheckCircle).
- Left column:
  - My Classes card with empty-state text and two skeleton class cards.
  - Recent Submissions card with table header but single empty row “No submissions yet.”.
- Right column:
  - Marking Queue card with CSS-drawn inbox illustration and “All caught up!” text.
  - This Week card with Mon–Sun pills, current design placeholder and “No sessions scheduled”.
  - Useful Links card:
    - IELTS Band Descriptors (external link, opens new tab).
    - Marking Guidelines → /teacher/resources.
    - Submit Feedback → /teacher/submissions.

Again, use the full implementation from the earlier answer and adapt imports if needed.

────────────────────────────────
STEP 7 — LAYOUT ROUTES
────────────────────────────────

Create minimal layouts so Next.js 15 routing is consistent:

Files:
- src/app/learner/layout.tsx
- src/app/admin/layout.tsx
- src/app/teacher/layout.tsx

Each should be a simple server component that passes children through and sets metadata, e.g.:

```tsx
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Learner Dashboard | Jaxtina LMS',
}

export default function LearnerLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
```

Do the same shape for admin and teacher with appropriate titles.

IMPORTANT:
- Do NOT wrap DashboardShell in these layouts; the pages already own the shell and perform auth checks.
- Keep layouts free of client components and hooks.

────────────────────────────────
STEP 8 — TYPECHECK AND BUILD
────────────────────────────────

After implementing all files:

1) Run TypeScript and build:

npm run lint || pnpm lint
npm run build || pnpm build

2) Fix ALL errors and warnings related to:
   - Wrong import paths
   - Importing client components into server components
   - Using invalid columns on profiles
   - Missing Lucide icons

3) Do NOT change existing middleware or auth callback logic. If a route conflict arises, prefer keeping /login and existing auth routes intact and ensure the new dashboards live under:

- /learner/dashboard
- /admin/dashboard
- /teacher/dashboard

4) Once build passes, stop.

────────────────────────────────
OUTPUT REQUIREMENTS
────────────────────────────────

When you respond:

- First, list all files you created or modified.
- For each file, show the full final contents.
- Ensure code is ready to paste directly into the repo with no TODOs left.
- Do not include explanations outside of brief file headers; the answer should be primarily code blocks.

```