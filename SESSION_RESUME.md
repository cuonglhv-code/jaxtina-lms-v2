# Jaxtina EduOS - Session Resume (2026-03-20)

## 🎯 Current Project Status
We have successfully transitioned from a static UI shell to a fully intelligent, high-performance marking ecosystem. The core "Marking Loop" (Learner Submit -> AI Evaluate -> Teacher Finalize -> Admin Oversight) is physically wired into Supabase and passing all type checks.

---

## 🏗️ 1. Architecture & Database
- **Schema**: Unified `user_profiles` system (student, teacher, admin).
- **Constraints**: 
  - `submissions`: Unique on `(student_id, activity_id)`.
  - `scores` / `feedback`: Unique on `submission_id`.
- **Security**: Full RLS policies implemented for domain-specific access.
- **Standards**: `npx tsc --noEmit` is currently **Exit Code 0**.

## ✍️ 2. Learner Experience: "Focus Studio"
- **UI**: Premium writing interface with IELTS word counters.
- **Pipeline**: Background auto-save (10s interval) via `saveDraftAction`.
- **Logic**: Submissions lock upon completion and trigger the AI background task.

## 🤖 3. AI Intelligence: "The Brain"
- **Model**: Claude 3.5 Sonnet via Anthropic SDK.
- **Contract**: `IELTSEvaluation` interface (overallBand, 4 pillars, keyImprovements).
- **Orchestration**: Fire-and-forget `runAIBackgroundTasks` in `actions.ts`. 
- **Logging**: Raw traces stored in `ai_feedback_logs` for debugging and MAE calculation.

## 👩‍🏫 4. Teacher & Admin Tooling
- **Examiner Studio**: Split-screen marking interface with AI-prefilled forms.
- **Command Center**: Custom SVG analytics dashboard (Zero-dependency).
- **Metrics**: Real-time throughput funnel and **Mean Absolute Error (MAE)** tracking for AI accuracy.

---

## 🚀 Next Phase: Phase 5 - The Results Studio
**Goal**: Close the loop for the student.
**Path**: `/learner/results/[id]/page.tsx`
**Requirements**:
1. Fetch finalized `scores` and `feedback` (where `is_visible: true`).
2. Build a high-impact "Band Reveal" header using **Instrument Serif**.
3. Create a 'Criteria Scorecard' using the **Jade/Ocean** palette.
4. Display actionable 'Key Improvements' to guide the student's next practice session.

## 🛠️ Instructions for Claude
"I have provided the retrospective above. Please acknowledge the current state of the database and the existing server actions in `src/app/(learner)/actions.ts` and `src/app/(teacher)/actions.ts`. 

Our first task for today is **Phase 5: The Student Results Studio**. Please draft a plain-English UI/UX plan for this page before we write any code."