# Milestone 3 Plan: Student Flows

## 1. Overview
The goal of this milestone is to implement the core user experience for students, from browsing available courses to accessing lesson materials and completing activities.

## 2. Sub-tasks
- [x] **Implement student dashboard UI**: Create a personalized "home base" for students (Completed partially, needs refinement for data fetching).
- [ ] **Build course enrolment mechanics**: Implement a course catalog/browser and the ability for students to view their specific class details.
- [ ] **Create materials viewing interface**: Build pages for Lessons (Markdown/PDF/Video viewing).
- [ ] **Build activity completion system**: Implement UI for quizzes, essay submissions (text area), and file uploads.

## 3. File Changes
- `src/app/(learner)/courses/page.tsx`: Course catalog.
- `src/app/(learner)/courses/[id]/page.tsx`: Course overview and module list.
- `src/app/(learner)/lessons/[id]/page.tsx`: Lesson content and activity listing.
- `src/app/(learner)/activities/[id]/page.tsx`: Activity submission interface.
- `src/components/activities/...`: Question types and submission forms.

## 4. Verification Steps
- **Auth Check**: Ensure all `/learner` routes redirect to sign-in if no session exists.
- **Data Check**: Verify lessons appear correctly for enrolled courses.
- **Submission Check**: Confirm `submissions` table is updated when an activity is completed.
- **UI Verification**: Use browser agent to check layout of the Course Catalog and Lesson pages.
