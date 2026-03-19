# Milestone 4 Plan: Teacher Tools

## 1. Overview
The goal of this milestone is to empower teachers with tools to create curriculum content and manage their classes, including marking student submissions.

## 2. Sub-tasks
- [ ] **Create teacher dashboard UI**: Refine the workspace for teachers to manage their students and marking queues.
- [ ] **Build course/activity creator tools**: Implement forms for creating new courses, modules, lessons, and activities.
- [ ] **Implement marking UI for submissions**: Build an interface for teachers to view student answers and write feedback/assign scores.

## 3. File Changes
- `src/app/(teacher)/dashboard/page.tsx`: Main teacher workspace.
- `src/app/(teacher)/courses/new/page.tsx`: Course creation form.
- `src/app/(teacher)/courses/[id]/edit/page.tsx`: Course editor.
- `src/app/(teacher)/marking/page.tsx`: Marking queue.
- `src/app/(teacher)/marking/[id]/page.tsx`: Marking submission interface.
- `src/components/teacher/...`: Editor components and marking tools.

## 4. Verification Steps
- **Auth Check**: Ensure `/teacher` routes redirect to sign-in if no teacher session exists.
- **Form Check**: Verify new courses, modules, and lessons are correctly saved to Supabase.
- **Marking Check**: Confirm score and feedback are correctly saved to the `submissions` table.
- **UI Verification**: Use browser agent to check layout of the Course Creator and Marking Queue.
