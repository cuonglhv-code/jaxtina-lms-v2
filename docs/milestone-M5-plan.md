# Milestone 5 Plan: Admin Tools & Dashboards

## 1. Overview
The goal of this milestone is to provide the "Global Control" for the English Centre Manager to manage users, track overall performance, and monitor teacher workloads.

## 2. Sub-tasks
- [ ] **Create admin dashboard UI**: Complete the main statistics and analytics view for the owner.
- [ ] **Build user and role management tools**: Create an interface at `/admin/users` to view/edit users and assign roles (Student/Teacher/Admin).
- [ ] **Implement centre analytics**: Build views for course enrollment trends and teacher performance.
- [ ] **Course/Class Overview**: High-level view for monitoring course health and student at-risk status.

## 3. File Changes
- `src/app/(admin)/dashboard/page.tsx`: Main admin hub.
- `src/app/(admin)/users/page.tsx`: User list and role editor.
- `src/app/(admin)/classes/page.tsx`: Global class and teacher monitor.
- `src/app/(admin)/actions.ts`: Admin-only server actions for user promotion and system settings.
- `src/components/admin/...`: Specialized charts and management tables.

## 4. Verification Steps
- **Auth Check**: Ensure `/admin` routes are strictly accessible ONLY to users with the `admin` role in Supabase.
- **Role Check**: Verify that an Admin can successfully promote a Student to a Teacher.
- **Analytics Check**: Confirm data is correctly aggregated from `enrolments` and `submissions` tables.
- **UI Verification**: Use browser agent to check layout of the User Management table and Stats cards.
