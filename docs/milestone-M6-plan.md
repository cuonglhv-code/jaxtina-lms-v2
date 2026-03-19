# Milestone 6 Plan: AI Services

## 1. Overview
The goal of this milestone is to integrate AI features into the LMS using the Claude API (Anthropic). This includes essay marking, speaking transcript feedback, and a teacher content generation assistant.

## 2. Sub-tasks
- [ ] **Install Anthropic SDK**: Add `@anthropic-ai/sdk` to the project.
- [ ] **Create API route for AI essay feedback**: Endpoint `/api/ai/essay` to grade writing tasks based on IELTS/TOEIC rubrics.
- [ ] **Create API route for AI speaking feedback**: Endpoint `/api/ai/speaking` to grade speaking transcripts.
- [ ] **Create API route for teacher content assistant**: Endpoint `/api/ai/content` to help teachers generate lesson ideas, quizzes, or vocabulary lists.
- [ ] **Integrate AI feedback logging**: Save the raw output from Claude to the `ai_feedback_logs` table (if defined in schema, or define it) for auditing.

## 3. File Changes
- `src/lib/anthropic.ts`: Shared Anthropic client instance.
- `src/app/api/ai/essay/route.ts`: Essay feedback handler.
- `src/app/api/ai/speaking/route.ts`: Speaking feedback handler.
- `src/app/api/ai/content/route.ts`: Teacher assistant handler.
- `.env.local`: Add `ANTHROPIC_API_KEY` placeholder.

## 4. Verification Steps
- **Environment**: Confirm key placeholder is in `.env.local`.
- **Dependencies**: Ensure SDK is installed.
- **Endpoints**: Review API routes to ensure they correctly format prompts for Claude and return JSON structure for the frontend to consume.
- **Security**: Endpoint must check for valid Supabase user session before calling the LLM.
