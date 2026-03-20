-- =============================================================================
-- JAXTINA LMS — COMPREHENSIVE SEED FILE
-- =============================================================================
--
-- HOW TO RUN:
--   Option 1 (Supabase Studio):
--     1. Open Supabase Studio → SQL Editor
--     2. Paste the entire contents of this file
--     3. Click "Run"
--
--   Option 2 (Supabase CLI):
--     supabase db reset   (runs migrations + seed automatically)
--     OR
--     supabase db execute --file supabase/seed/comprehensive_seed.sql
--
-- TEST CREDENTIALS (all passwords = "Test1234!"):
--   Admin:
--     admin@jaxtina.com         — super_admin
--
--   Teachers:
--     teacher1@jaxtina.com      — teacher (Tran Thi Lan)
--     teacher2@jaxtina.com      — teacher (Le Van Minh)
--
--   Learners:
--     learner1@jaxtina.com      — learner (Pham Thi Thu)
--     learner2@jaxtina.com      — learner (Hoang Van Duc)
--     learner3@jaxtina.com      — learner (Nguyen Thi Mai)
--     learner4@jaxtina.com      — learner (Vo Van Tuan)
--     learner5@jaxtina.com      — learner (Do Thi Hoa)
--     learner6@jaxtina.com      — learner (Bui Van Nam)
--     learner7@jaxtina.com      — learner (Ly Thi Thuy)
--     learner8@jaxtina.com      — learner (Phan Van Long)
--     learner9@jaxtina.com      — learner (Tran Thi Ngoc)
--     learner10@jaxtina.com     — learner (Dang Van Hung)
--
-- DATA CREATED:
--   - 12 auth.users + matching user_profiles
--   - 3 published courses (IELTS Writing, IELTS Speaking, General English)
--   - 8 modules, 20 lessons
--   - 10 activities (essays, speaking, quiz types)
--   - 3 classes with teacher and student enrolments
--   - 9 submissions across 4 learners
--   - 5 scores and 5 feedback records
-- =============================================================================

BEGIN;

-- =============================================================================
-- SECTION 1: AUTH.USERS
-- Fixed UUIDs so this seed is idempotent.
-- =============================================================================

-- Admin
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000001-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'admin@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Nguyen Van Admin"}'::jsonb,
  NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Teacher 1
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0000001-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'teacher1@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Tran Thi Lan"}'::jsonb,
  NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Teacher 2
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0000002-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'teacher2@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Le Van Minh"}'::jsonb,
  NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 1
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000001-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'learner1@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Pham Thi Thu"}'::jsonb,
  '2026-01-05 08:00:00+00', '2026-01-05 08:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 2
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000002-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'learner2@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Hoang Van Duc"}'::jsonb,
  '2026-01-05 09:00:00+00', '2026-01-05 09:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 3
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000003-0000-0000-0000-000000000003',
  'authenticated', 'authenticated',
  'learner3@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Nguyen Thi Mai"}'::jsonb,
  '2026-01-06 10:00:00+00', '2026-01-06 10:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 4
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000004-0000-0000-0000-000000000004',
  'authenticated', 'authenticated',
  'learner4@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Vo Van Tuan"}'::jsonb,
  '2026-01-07 11:00:00+00', '2026-01-07 11:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 5
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000005-0000-0000-0000-000000000005',
  'authenticated', 'authenticated',
  'learner5@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Do Thi Hoa"}'::jsonb,
  '2026-01-08 08:30:00+00', '2026-01-08 08:30:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 6
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000006-0000-0000-0000-000000000006',
  'authenticated', 'authenticated',
  'learner6@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Bui Van Nam"}'::jsonb,
  '2026-01-08 09:00:00+00', '2026-01-08 09:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 7
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000007-0000-0000-0000-000000000007',
  'authenticated', 'authenticated',
  'learner7@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Ly Thi Thuy"}'::jsonb,
  '2026-01-09 10:00:00+00', '2026-01-09 10:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 8
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000008-0000-0000-0000-000000000008',
  'authenticated', 'authenticated',
  'learner8@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Phan Van Long"}'::jsonb,
  '2026-01-09 11:00:00+00', '2026-01-09 11:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 9
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000009-0000-0000-0000-000000000009',
  'authenticated', 'authenticated',
  'learner9@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Tran Thi Ngoc"}'::jsonb,
  '2026-02-01 08:00:00+00', '2026-02-01 08:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Learner 10
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0000010-0000-0000-0000-000000000010',
  'authenticated', 'authenticated',
  'learner10@jaxtina.com',
  crypt('Test1234!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Dang Van Hung"}'::jsonb,
  '2026-02-01 09:00:00+00', '2026-02-01 09:00:00+00', '', '', '', ''
) ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 2: USER_PROFILES
-- =============================================================================

INSERT INTO user_profiles (id, role, full_name, display_name, email, phone, preferred_lang, created_at, updated_at)
VALUES
  -- Admin
  (
    'a0000001-0000-0000-0000-000000000001',
    'super_admin',
    'Nguyen Van Admin',
    'Admin',
    'admin@jaxtina.com',
    '0901000001',
    'vi',
    NOW(), NOW()
  ),
  -- Teacher 1
  (
    'b0000001-0000-0000-0000-000000000001',
    'teacher',
    'Tran Thi Lan',
    'Ms. Lan',
    'teacher1@jaxtina.com',
    '0901000002',
    'vi',
    NOW(), NOW()
  ),
  -- Teacher 2
  (
    'b0000002-0000-0000-0000-000000000002',
    'teacher',
    'Le Van Minh',
    'Mr. Minh',
    'teacher2@jaxtina.com',
    '0901000003',
    'vi',
    NOW(), NOW()
  ),
  -- Learner 1
  (
    'c0000001-0000-0000-0000-000000000001',
    'learner',
    'Pham Thi Thu',
    'Thu',
    'learner1@jaxtina.com',
    '0902000001',
    'vi',
    '2026-01-05 08:00:00+00',
    '2026-01-05 08:00:00+00'
  ),
  -- Learner 2
  (
    'c0000002-0000-0000-0000-000000000002',
    'learner',
    'Hoang Van Duc',
    'Duc',
    'learner2@jaxtina.com',
    '0902000002',
    'vi',
    '2026-01-05 09:00:00+00',
    '2026-01-05 09:00:00+00'
  ),
  -- Learner 3
  (
    'c0000003-0000-0000-0000-000000000003',
    'learner',
    'Nguyen Thi Mai',
    'Mai',
    'learner3@jaxtina.com',
    '0902000003',
    'vi',
    '2026-01-06 10:00:00+00',
    '2026-01-06 10:00:00+00'
  ),
  -- Learner 4
  (
    'c0000004-0000-0000-0000-000000000004',
    'learner',
    'Vo Van Tuan',
    'Tuan',
    'learner4@jaxtina.com',
    '0902000004',
    'vi',
    '2026-01-07 11:00:00+00',
    '2026-01-07 11:00:00+00'
  ),
  -- Learner 5
  (
    'c0000005-0000-0000-0000-000000000005',
    'learner',
    'Do Thi Hoa',
    'Hoa',
    'learner5@jaxtina.com',
    '0902000005',
    'vi',
    '2026-01-08 08:30:00+00',
    '2026-01-08 08:30:00+00'
  ),
  -- Learner 6
  (
    'c0000006-0000-0000-0000-000000000006',
    'learner',
    'Bui Van Nam',
    'Nam',
    'learner6@jaxtina.com',
    '0902000006',
    'vi',
    '2026-01-08 09:00:00+00',
    '2026-01-08 09:00:00+00'
  ),
  -- Learner 7
  (
    'c0000007-0000-0000-0000-000000000007',
    'learner',
    'Ly Thi Thuy',
    'Thuy',
    'learner7@jaxtina.com',
    '0902000007',
    'vi',
    '2026-01-09 10:00:00+00',
    '2026-01-09 10:00:00+00'
  ),
  -- Learner 8
  (
    'c0000008-0000-0000-0000-000000000008',
    'learner',
    'Phan Van Long',
    'Long',
    'learner8@jaxtina.com',
    '0902000008',
    'vi',
    '2026-01-09 11:00:00+00',
    '2026-01-09 11:00:00+00'
  ),
  -- Learner 9
  (
    'c0000009-0000-0000-0000-000000000009',
    'learner',
    'Tran Thi Ngoc',
    'Ngoc',
    'learner9@jaxtina.com',
    '0902000009',
    'vi',
    '2026-02-01 08:00:00+00',
    '2026-02-01 08:00:00+00'
  ),
  -- Learner 10
  (
    'c0000010-0000-0000-0000-000000000010',
    'learner',
    'Dang Van Hung',
    'Hung',
    'learner10@jaxtina.com',
    '0902000010',
    'vi',
    '2026-02-01 09:00:00+00',
    '2026-02-01 09:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 3: COURSES
-- =============================================================================

INSERT INTO courses (id, title, description, exam_type, level, target_skill, is_published, created_at, updated_at)
VALUES
  -- Course 1: IELTS Academic Writing
  (
    'd0000001-0000-0000-0000-000000000001',
    'IELTS Academic Writing Mastery',
    'A comprehensive course designed to take you from intermediate level to IELTS Band 7+ in Academic Writing. You will master both Task 1 (data description) and Task 2 (essay writing) through structured lessons, real exam practice, and personalized AI-assisted feedback. Topics include describing graphs and charts, structuring academic essays, building a high-scoring vocabulary, and achieving cohesion and coherence.',
    'IELTS',
    'Intermediate',
    'Writing',
    TRUE,
    '2025-12-01 08:00:00+00',
    '2025-12-01 08:00:00+00'
  ),
  -- Course 2: IELTS Speaking Mastery
  (
    'd0000002-0000-0000-0000-000000000002',
    'IELTS Speaking Mastery',
    'Build confidence and fluency for all three parts of the IELTS Speaking exam. This course covers interview strategies for Part 1, long-turn speaking techniques for Part 2 (cue cards), and advanced discussion skills for Part 3. Develop natural pronunciation, vocabulary range, and grammatical accuracy through guided practice and model answers.',
    'IELTS',
    'Upper-Intermediate',
    'Speaking',
    TRUE,
    '2025-12-05 08:00:00+00',
    '2025-12-05 08:00:00+00'
  ),
  -- Course 3: General English Foundation
  (
    'd0000003-0000-0000-0000-000000000003',
    'General English Foundation',
    'A beginner-friendly course covering the essential building blocks of English communication. Students will learn core grammar structures, everyday vocabulary, and practical conversational phrases used in real-life situations such as greetings, shopping, travel, and work. No prior knowledge required.',
    'General English',
    'Beginner',
    NULL,
    TRUE,
    '2025-12-10 08:00:00+00',
    '2025-12-10 08:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 4: MODULES
-- =============================================================================

INSERT INTO modules (id, course_id, title, order_index, created_at)
VALUES
  -- Course 1 Modules
  (
    'e0000001-0000-0000-0000-000000000001',
    'd0000001-0000-0000-0000-000000000001',
    'Writing Foundations',
    1,
    '2025-12-01 08:00:00+00'
  ),
  (
    'e0000002-0000-0000-0000-000000000002',
    'd0000001-0000-0000-0000-000000000001',
    'Task 1 — Data Description',
    2,
    '2025-12-01 08:00:00+00'
  ),
  (
    'e0000003-0000-0000-0000-000000000003',
    'd0000001-0000-0000-0000-000000000001',
    'Task 2 — Essay Writing',
    3,
    '2025-12-01 08:00:00+00'
  ),
  -- Course 2 Modules
  (
    'e0000004-0000-0000-0000-000000000004',
    'd0000002-0000-0000-0000-000000000002',
    'Part 1 — Introduction & Interview',
    1,
    '2025-12-05 08:00:00+00'
  ),
  (
    'e0000005-0000-0000-0000-000000000005',
    'd0000002-0000-0000-0000-000000000002',
    'Part 2 — Long Turn (Cue Cards)',
    2,
    '2025-12-05 08:00:00+00'
  ),
  (
    'e0000006-0000-0000-0000-000000000006',
    'd0000002-0000-0000-0000-000000000002',
    'Part 3 — Two-Way Discussion',
    3,
    '2025-12-05 08:00:00+00'
  ),
  -- Course 3 Modules
  (
    'e0000007-0000-0000-0000-000000000007',
    'd0000003-0000-0000-0000-000000000003',
    'Grammar Basics',
    1,
    '2025-12-10 08:00:00+00'
  ),
  (
    'e0000008-0000-0000-0000-000000000008',
    'd0000003-0000-0000-0000-000000000003',
    'Everyday Vocabulary',
    2,
    '2025-12-10 08:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 5: LESSONS
-- =============================================================================

INSERT INTO lessons (id, module_id, title, content, order_index, created_at)
VALUES

  -- ── Module 1: Writing Foundations ──────────────────────────────────────────

  (
    'f0000001-0000-0000-0000-000000000001',
    'e0000001-0000-0000-0000-000000000001',
    'Understanding Task 1 & Task 2',
    'The IELTS Academic Writing test consists of two tasks completed in 60 minutes.

**Task 1 (20 minutes, 150 words minimum):**
You are presented with a graph, chart, table, diagram, or map and must describe the key information in your own words. You are NOT asked to give opinions — only to describe and compare data objectively. The examiner assesses how accurately you identify key trends and how well you organise and express information.

**Task 2 (40 minutes, 250 words minimum):**
You write an essay in response to a point of view, argument, or problem. You must present a clear position, support your ideas with relevant examples, and write in a formal academic style. Task 2 carries twice the marks of Task 1, so time management is critical.

**Scoring Criteria (both tasks):**
- Task Achievement / Task Response
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy

Each criterion is scored from 0 to 9. Your overall band is the average of all four criteria.',
    1,
    '2025-12-01 08:00:00+00'
  ),
  (
    'f0000002-0000-0000-0000-000000000002',
    'e0000001-0000-0000-0000-000000000001',
    'Academic Vocabulary Essentials',
    'A high Lexical Resource score requires you to use a wide range of vocabulary accurately and appropriately. In academic writing, this means avoiding informal language and instead using precise, formal alternatives.

**Key Principles:**
1. Avoid repetition — use synonyms and paraphrasing.
2. Use collocations correctly (e.g., "reach a peak", "experience a decline").
3. Use hedging language for uncertain data (e.g., "approximately", "roughly", "around").
4. Use discourse markers to guide the reader (e.g., "Furthermore", "In contrast", "Notably").

**Common Trend Vocabulary (Task 1):**
- Rise: increase, grow, climb, surge, jump, rocket
- Fall: decrease, decline, drop, fall, plummet, dip
- Stable: remain stable, level off, plateau, stay constant
- Peak/Trough: reach a peak of, hit a high of, bottom out at, fall to a low of

**Academic Linkers (Task 2):**
- Adding ideas: Furthermore, Moreover, In addition, Additionally
- Contrasting: However, Nevertheless, On the other hand, Despite this
- Concluding: In conclusion, To sum up, Overall, In summary

Practise using these words in your own sentences before the exam.',
    2,
    '2025-12-01 08:00:00+00'
  ),
  (
    'f0000003-0000-0000-0000-000000000003',
    'e0000001-0000-0000-0000-000000000001',
    'Cohesion and Coherence',
    'Coherence refers to how logically your ideas are organised. Cohesion refers to how well sentences and paragraphs are connected using linking language and reference devices.

**Coherence Strategies:**
- Use a clear paragraph structure: Topic Sentence → Supporting Detail → Example → Conclusion/Transition.
- Each paragraph should develop one main idea.
- Use a logical order: general → specific, or problem → solution.

**Cohesion Strategies:**
1. **Referencing** — use pronouns and demonstratives to avoid repetition (e.g., "This trend suggests...", "These figures indicate...").
2. **Substitution** — replace a word or phrase with another (e.g., "Many students struggle with grammar. This issue can be resolved with practice." — "issue" substitutes "struggle with grammar").
3. **Conjunctions** — connect clauses (e.g., "Although", "While", "Whereas", "Because").
4. **Lexical Chains** — use vocabulary from the same topic area throughout a paragraph.

**Common Mistakes:**
- Starting every sentence with a linking word (over-use of cohesive devices).
- Writing all sentences with the same structure.
- Using "Firstly, Secondly, Thirdly" for every paragraph without variety.',
    3,
    '2025-12-01 08:00:00+00'
  ),

  -- ── Module 2: Task 1 — Data Description ───────────────────────────────────

  (
    'f0000004-0000-0000-0000-000000000004',
    'e0000002-0000-0000-0000-000000000002',
    'Describing Bar Charts',
    'Bar charts compare quantities across different categories or time periods. A high-scoring response will:
1. Paraphrase the question in an introduction (do NOT copy the task wording).
2. Write an Overview paragraph identifying the most significant features without detailed data.
3. Write 2 body paragraphs grouping related data and including precise figures.

**Standard Structure:**
- Paragraph 1 (Introduction): Paraphrase the chart title and source.
- Paragraph 2 (Overview): Identify 2-3 key trends without numbers.
- Paragraph 3 & 4 (Details): Select and compare data with specific figures.

**Useful Sentence Patterns:**
- "The bar chart illustrates / compares / shows..."
- "Overall, it is clear that..."
- "The highest proportion was recorded in [category], at [X]%..."
- "By contrast, [category] showed the lowest figure, with only [X]..."
- "Both [A] and [B] followed a similar pattern, with..."

**Practice Tip:**
Always write your overview FIRST (before the body paragraphs), even if it appears second in your essay. This ensures you focus on the big picture before the details.',
    1,
    '2025-12-02 08:00:00+00'
  ),
  (
    'f0000005-0000-0000-0000-000000000005',
    'e0000002-0000-0000-0000-000000000002',
    'Describing Line Graphs',
    'Line graphs show how data changes over time. The key skills are describing trends (direction and speed of change) and comparing multiple lines.

**Describing Direction:**
- Upward trend: rose, increased, climbed, grew, surged
- Downward trend: fell, dropped, decreased, declined, plummeted
- Stable: remained constant, levelled off, stayed the same, plateaued
- Fluctuation: fluctuated, varied, was volatile

**Describing Speed/Degree:**
- Fast: sharply, rapidly, steeply, dramatically, significantly
- Slow: gradually, steadily, slightly, marginally, modestly

**Combining Direction + Speed:**
"The number of users rose sharply..."
"Sales declined gradually between 2010 and 2015..."
"Prices fluctuated slightly throughout the period..."

**Describing a Peak or Trough:**
"The figure reached a peak of 80% in 2018 before declining..."
"Usage bottomed out at 15% in 2005 and then began to recover..."

**Comparing Lines:**
"Country A consistently recorded higher usage than Country B throughout the period."
"While [A] showed a steady increase, [B] experienced a dramatic decline."

**Time References:**
Use time phrases accurately: "from 2000 to 2010", "between 2005 and 2015", "over the 20-year period", "by 2020".',
    2,
    '2025-12-02 08:00:00+00'
  ),
  (
    'f0000006-0000-0000-0000-000000000006',
    'e0000002-0000-0000-0000-000000000002',
    'Process Diagrams',
    'Process diagrams show the stages involved in making something or how a system works. Unlike graphs, they are not about numbers — they are about sequence and transformation.

**Key Differences from Other Task 1 Charts:**
- No data comparison required.
- Focus on sequencing language (first, then, next, after this, finally).
- Use passive voice to describe processes (e.g., "The materials are collected → sorted → processed").
- Describe ALL stages — examiners check completeness.

**Structure:**
1. Introduction: Paraphrase the diagram title.
2. Overview: State how many stages there are and whether it is a linear or cyclical process.
3. Body Paragraphs: Describe the stages in order, grouping logically (e.g., first half / second half).

**Useful Language:**
- "The process begins when / with..."
- "In the first stage, [material] is [verb-ed]..."
- "This is then [verb-ed] before being [verb-ed]..."
- "In the final stage, the finished product is..."
- "The cycle then repeats / The process is complete."

**Passive Voice Practice:**
Active: "Workers collect the raw materials."
Passive: "The raw materials are collected." ← preferred in academic writing.',
    3,
    '2025-12-02 08:00:00+00'
  ),

  -- ── Module 3: Task 2 — Essay Writing ──────────────────────────────────────

  (
    'f0000007-0000-0000-0000-000000000007',
    'e0000003-0000-0000-0000-000000000003',
    'Opinion Essays',
    'Opinion essays (also called "Agree/Disagree" or "To what extent do you agree?" essays) require you to state and defend a clear personal position throughout the entire essay.

**Essay Structure:**
1. **Introduction** (~50 words): Paraphrase the statement → Give your clear opinion (Thesis Statement).
2. **Body Paragraph 1** (~90 words): Main reason supporting your view → Explain → Example.
3. **Body Paragraph 2** (~90 words): Second reason → Explain → Example.
4. **Conclusion** (~50 words): Restate your opinion → Summarise key points (no new ideas).

**Critical Mistake to Avoid:**
Do NOT say "I partially agree" or "There are two sides to this" in an opinion essay. Pick ONE clear position and maintain it throughout.

**Example Introduction:**
Prompt: "Technology has made modern life more complicated."
Strong Response: "While some argue that modern technology has brought unnecessary complexity to daily life, I strongly disagree with this view. In my opinion, technological advances have fundamentally simplified and enriched the way people live and work."

**Band 7+ Tips:**
- Include specific real-world examples (not just "for example, people use phones").
- Use "This suggests that..." or "This demonstrates that..." after examples to link them to your argument.
- Vary sentence structures: simple, compound, and complex sentences in each paragraph.',
    1,
    '2025-12-03 08:00:00+00'
  ),
  (
    'f0000008-0000-0000-0000-000000000008',
    'e0000003-0000-0000-0000-000000000003',
    'Discussion Essays',
    'Discussion essays ("Discuss both views and give your own opinion") require you to fairly present BOTH sides of an argument before giving your own view.

**Essay Structure:**
1. **Introduction** (~50 words): Introduce the topic → State you will discuss both views and give your opinion.
2. **Body Paragraph 1** (~90 words): First view — explain and support with examples.
3. **Body Paragraph 2** (~90 words): Second view — explain and support with examples.
4. **Conclusion** (~60 words): Summarise both views → Clearly state your own position.

**Common Mistake:**
Students often forget to give their own opinion at the end. The task says "give your own opinion", so it is required — not optional.

**Useful Language:**
- "On the one hand, proponents of [view A] argue that..."
- "On the other hand, those who favour [view B] contend that..."
- "While both perspectives have merit, I believe that..."
- "From my perspective, the stronger argument is..."

**Paragraph Transition:**
"Having considered the argument in favour of [A], it is important to acknowledge the alternative view."

**Example Topic: Environmental Responsibility**
View A: Individuals must reduce their carbon footprints through lifestyle changes.
View B: Only government policy and corporate regulation can deliver meaningful environmental change.
Your Opinion: Both are needed, but structural change (View B) has greater scale and impact.',
    2,
    '2025-12-03 08:00:00+00'
  ),
  (
    'f0000009-0000-0000-0000-000000000009',
    'e0000003-0000-0000-0000-000000000003',
    'Problem-Solution Essays',
    'Problem-Solution essays ask you to identify the causes or problems associated with an issue and propose realistic, well-developed solutions.

**Essay Structure:**
1. **Introduction** (~50 words): Introduce the issue → Outline that causes/problems and solutions will be discussed.
2. **Body Paragraph 1 — Problems** (~100 words): Identify 2 key problems and explain why they occur.
3. **Body Paragraph 2 — Solutions** (~100 words): Propose 2 realistic solutions that address the stated problems.
4. **Conclusion** (~50 words): Summarise the key problems and recommended solutions.

**Key Principle: Problems and Solutions Must Match**
If Problem 1 is "inadequate public transport leads to car dependency", then Solution 1 should address public transport investment. A solution that does not connect to a stated problem loses marks for Task Achievement.

**Useful Language:**
- Problems: "One of the primary causes of [issue] is...", "This has resulted in...", "A major consequence is..."
- Solutions: "This could be addressed by...", "Governments should invest in...", "An effective solution would be to..."
- Linking: "In order to tackle this problem...", "If [solution] were implemented, then..."

**Traffic Congestion Example:**
Problem 1: Rapid urbanisation + insufficient road infrastructure → gridlock in peak hours.
Solution 1: Government investment in metro rail and bus rapid transit systems.
Problem 2: Over-reliance on private vehicles due to lack of alternatives.
Solution 2: Congestion charges in city centres and subsidised public transport passes.',
    3,
    '2025-12-03 08:00:00+00'
  ),

  -- ── Module 4: IELTS Speaking Part 1 ───────────────────────────────────────

  (
    'f0000010-0000-0000-0000-000000000010',
    'e0000004-0000-0000-0000-000000000004',
    'Part 1 Foundations: Answering Familiar Questions',
    'IELTS Speaking Part 1 lasts 4–5 minutes. The examiner asks questions about familiar topics such as your home, family, work/study, hobbies, and daily routines.

**Key Strategies:**
1. Give extended answers (2–4 sentences), not one-word replies.
2. Use a range of tenses: present simple for habits, present continuous for ongoing activities, past simple for experiences.
3. Show vocabulary range by paraphrasing the question word in your answer.

**PEEL Structure for Part 1:**
- **P**oint: Answer the question directly.
- **E**xplain: Give a reason or detail.
- **E**xample: Give a personal example.
- **L**ink: Optional — add a contrasting or related thought.

**Example Q&A:**
Q: "Do you enjoy cooking?"
Weak: "Yes, I like it."
Strong: "Yes, I really enjoy cooking, especially on weekends when I have more time. I find it quite relaxing — there is something satisfying about preparing a meal from scratch. Recently, I have been trying to learn more Vietnamese recipes from my grandmother."

**Common Mistakes:**
- Memorised answers (examiners can detect these and it will affect your Fluency score).
- Answers that are too short or too long (aim for 3–4 natural sentences).
- Speaking too fast due to nerves — slow down and articulate clearly.',
    1,
    '2025-12-05 08:00:00+00'
  ),
  (
    'f0000011-0000-0000-0000-000000000011',
    'e0000004-0000-0000-0000-000000000004',
    'Common Part 1 Topics and Model Answers',
    'This lesson covers the most frequently tested Part 1 topics with model answers at Band 7 level.

**Topic: Hometown**
Q: "Tell me about your hometown."
Model: "I am from Hanoi, the capital of Vietnam, which is a fascinating mix of the old and new. The Old Quarter is particularly special — narrow streets lined with traditional shophouses selling everything from silk to street food. In recent years, however, the city has expanded rapidly with new districts, modern skyscrapers, and international businesses. I am quite proud of it, though I must admit the traffic can be quite chaotic at peak hours!"

**Topic: Free Time / Hobbies**
Q: "What do you like to do in your free time?"
Model: "Outside of studying, I spend a lot of my free time reading — mainly non-fiction books about history and science. I find it is a great way to unwind after a long day. I also try to go for a run a few times a week, which helps me clear my head. Occasionally, my friends and I will go to a café to catch up, which I always look forward to."

**Topic: Transport**
Q: "How do you usually travel around your city?"
Model: "I mainly use a motorbike to get around, which is by far the most convenient option in Vietnam. The public bus system has improved a lot recently, but it can still be unreliable during rush hour. I sometimes use ride-hailing apps like Grab for longer journeys, especially when the traffic is particularly bad. I think the city really needs to invest more in the metro system to reduce congestion."',
    2,
    '2025-12-05 08:00:00+00'
  ),

  -- ── Module 5: IELTS Speaking Part 2 ───────────────────────────────────────

  (
    'f0000012-0000-0000-0000-000000000012',
    'e0000005-0000-0000-0000-000000000005',
    'Part 2 Structure: The 1-Minute Preparation',
    'IELTS Speaking Part 2 lasts approximately 3–4 minutes. You are given a cue card with a topic and bullet-point prompts, and 1 minute to prepare. You must then speak for 1–2 minutes.

**How to Use Your 1 Minute:**
1. Read the cue card fully — note ALL bullet points.
2. Decide your topic (choose something you can speak about confidently).
3. Write 2–3 key words or phrases for each bullet point.
4. Think of a strong, specific ending — something interesting or reflective.

**Standard Cue Card Structure:**
- Bullet 1: Describe the subject (what/who/where).
- Bullet 2: When / How often / Background details.
- Bullet 3: What you did / What happened.
- Final question: Why it is important / memorable to you.

**Timing Strategy:**
- Aim for 1.5–2 minutes.
- Do not rush through the bullet points — develop each one with 2–3 sentences.
- Use the final question as an opportunity to reflect personally (this often impresses examiners).

**Language to Show Range:**
- Past narrative: "I first came across [topic] when I was about 15 years old..."
- Sensory detail: "I clearly remember the smell of... / The atmosphere was incredibly..."
- Reflection: "Looking back, I think the reason this [experience/person/place] has stayed with me is..."',
    1,
    '2025-12-06 08:00:00+00'
  ),
  (
    'f0000013-0000-0000-0000-000000000013',
    'e0000005-0000-0000-0000-000000000005',
    'Model Cue Card Responses',
    'This lesson provides full model responses for common cue card topics.

**Cue Card: Describe a book you have read that you found interesting.**
Say: what the book is, what it is about, when you read it, and explain why you found it interesting.

Model Response (Band 7–8):
"I would like to talk about a book called Sapiens by Yuval Noah Harari, which I read about two years ago. It is a non-fiction book that traces the entire history of humankind — from early Homo sapiens in Africa all the way to the digital revolution and beyond. What makes it so compelling is the way Harari connects history, biology, and philosophy to explain how and why humans came to dominate the planet.

I read it over about three weeks, a chapter or two each evening before bed. I remember being particularly struck by his argument that money, religion, and nations are all essentially shared fictions — stories that humans collectively believe in, which allow large-scale cooperation. I had never thought about society in that way before.

The reason I found it so fascinating is that it genuinely changed the way I see the world. After reading it, I started questioning many assumptions I had always taken for granted. It inspired me to read more widely in history and anthropology. I would absolutely recommend it to anyone who enjoys thought-provoking, accessible non-fiction."

**Timing Note:** This response is approximately 1 minute 45 seconds at a natural pace — ideal for Part 2.',
    2,
    '2025-12-06 08:00:00+00'
  ),

  -- ── Module 6: IELTS Speaking Part 3 ───────────────────────────────────────

  (
    'f0000014-0000-0000-0000-000000000014',
    'e0000006-0000-0000-0000-000000000006',
    'Part 3: Abstract Discussion Skills',
    'IELTS Speaking Part 3 lasts 4–5 minutes. Questions are abstract, thematic, and connected to the Part 2 topic. You are expected to discuss opinions, speculate, and analyse complex issues at length.

**Key Differences from Part 1:**
- Questions ask for opinions on societal issues, not personal experiences.
- Longer, more developed answers are expected.
- You should acknowledge different perspectives (not just give your own view).

**How to Structure a Part 3 Answer:**
1. Give your opinion clearly.
2. Explain your reasoning.
3. Give an example or hypothetical scenario.
4. Acknowledge a counterpoint or nuance.

**Useful Language for Part 3:**
- Giving opinions: "In my view...", "I would argue that...", "From my perspective..."
- Speculating: "It is difficult to say for certain, but I imagine...", "I would expect that..."
- Acknowledging complexity: "Having said that...", "Of course, it depends on...", "This is quite a complex issue because..."
- Referring to general trends: "There seems to be a growing trend towards...", "More and more people are..."

**Example Q&A:**
Q: "Do you think reading habits have changed in recent years?"
Band 7+ Response: "I would say they have changed quite significantly, yes. While people are certainly reading less in the traditional sense — fewer physical books and newspapers — I think the total amount of reading has actually increased, just in different formats. Social media, online news, and digital articles mean people are consuming text almost constantly. However, I do worry that this kind of reading tends to be more superficial — people skim headlines rather than reading deeply. Whether that is a problem really depends on your definition of what reading is for."',
    1,
    '2025-12-07 08:00:00+00'
  ),
  (
    'f0000015-0000-0000-0000-000000000015',
    'e0000006-0000-0000-0000-000000000006',
    'Fluency, Pronunciation, and Reducing Hesitation',
    'Fluency and Coherence is one of four IELTS Speaking criteria. It does not mean speaking quickly — it means speaking smoothly and logically, with minimal hesitation.

**What Examiners Listen For:**
- Natural pace (not too fast, not too slow)
- Self-correction done quickly and naturally
- Coherent ideas that flow logically
- Appropriate use of fillers (not overuse)

**Natural Fillers (use sparingly):**
- "That is a good question — I would say..."
- "Hmm, let me think about that for a moment..."
- "Well, it really depends on..."
- "To be honest, I had not thought about it that way before, but..."

**Pronunciation Band Descriptors:**
- Band 5: Can be understood but pronunciation errors sometimes cause confusion.
- Band 6: Generally easy to understand; some mispronunciation.
- Band 7: Easy to understand; only occasional mispronunciation; attempts some features of connected speech.
- Band 8: Easy to understand throughout; uses features of connected speech (linking, reduction, stress).

**Practical Tips:**
1. Practise out loud daily — even 5 minutes reading aloud improves fluency.
2. Record yourself and listen back critically.
3. Focus on word stress: understanding WHICH syllable to stress is more important than a perfect accent.
4. Learn to chunk phrases: "I would like to talk about" → "I''d-like-to talk-about" (natural reduction).',
    2,
    '2025-12-07 08:00:00+00'
  ),

  -- ── Module 7: Grammar Basics ───────────────────────────────────────────────

  (
    'f0000016-0000-0000-0000-000000000016',
    'e0000007-0000-0000-0000-000000000007',
    'Present Simple and Present Continuous',
    'Welcome to General English! In this lesson we cover two of the most important tenses in English.

**Present Simple — Habits and Facts**
Form: Subject + base verb (+ s/es for he/she/it)
Use: Regular habits, routines, general truths, and permanent situations.

Examples:
- I study English every day.
- She works at a hospital.
- The sun rises in the east.
- They do not eat meat.

**Present Continuous — Actions Happening Now**
Form: Subject + am/is/are + verb-ing
Use: Actions happening right now, or temporary situations.

Examples:
- I am studying English right now.
- She is working from home this week.
- They are learning Vietnamese this year.
- It is raining outside.

**Key Difference:**
- "I work in a café." (permanent job — Present Simple)
- "I am working in a café." (temporary situation — Present Continuous)

**Time Signal Words:**
Present Simple: always, usually, often, sometimes, never, every day/week
Present Continuous: now, at the moment, currently, today, this week

**Common Mistake:**
Do NOT use stative verbs in the continuous form.
Wrong: "I am knowing the answer."
Correct: "I know the answer."

Stative verbs: know, understand, believe, think (opinion), like, love, hate, want, need, have (possession).',
    1,
    '2025-12-10 08:00:00+00'
  ),
  (
    'f0000017-0000-0000-0000-000000000017',
    'e0000007-0000-0000-0000-000000000007',
    'Past Simple: Talking About the Past',
    'The Past Simple is used to describe completed actions in the past.

**Regular Verbs:**
Form: verb + -ed
Examples: work → worked, study → studied, play → played

**Irregular Verbs (must be memorised):**
go → went | come → came | see → saw | eat → ate
have → had | do → did | make → made | take → took
buy → bought | think → thought | know → knew | say → said

**Positive:**
"I visited Ho Chi Minh City last year."
"She studied hard for the exam."
"They went to the cinema on Friday."

**Negative:**
Subject + did not + base verb
"I did not go to school yesterday."
"He did not eat breakfast this morning."

**Question:**
Did + subject + base verb?
"Did you see that film?" — "Yes, I did." / "No, I didn''t."
"Where did she go?" — "She went to the market."

**Time Expressions for Past Simple:**
yesterday, last week/month/year, in 2023, ago (two days ago), when I was a child, in the morning/afternoon

**Practice Exercise:**
Complete with the correct past simple form:
1. Yesterday I _____ (go) to the supermarket.
2. She _____ (not/eat) lunch because she _____ (be) busy.
3. _____ you _____ (finish) your homework?',
    2,
    '2025-12-10 08:00:00+00'
  ),

  -- ── Module 8: Everyday Vocabulary ─────────────────────────────────────────

  (
    'f0000018-0000-0000-0000-000000000018',
    'e0000008-0000-0000-0000-000000000008',
    'Greetings, Introductions, and Farewells',
    'Being able to greet people and introduce yourself is one of the most important communication skills in English.

**Formal Greetings (work, meetings, strangers):**
- "Good morning / Good afternoon / Good evening."
- "How do you do?" (very formal, first meeting) → Reply: "How do you do?"
- "It is a pleasure to meet you."
- "How are you?" → "I am very well, thank you. And you?"

**Informal Greetings (friends, classmates):**
- "Hi! / Hey!"
- "How are you?" / "How is it going?" / "How are things?"
- "What''s up?" (very casual) → "Not much, just studying."
- "Long time no see!" (after not meeting for a while)

**Introducing Yourself:**
- "My name is [name]. I am from [city/country]."
- "I am a student at [school]. I am studying [subject]."
- "Nice to meet you! / Pleased to meet you!"

**Farewells:**
- Formal: "Goodbye. It was a pleasure meeting you." / "Have a good day."
- Informal: "See you later!" / "Take care!" / "Catch you later!"
- End of working day: "Have a good evening!" / "See you tomorrow!"

**Practice Dialogue:**
A: "Good morning! My name is Minh. Nice to meet you."
B: "Good morning, Minh. I am Sarah. Nice to meet you too. Are you new here?"
A: "Yes, I just started this week. I am really enjoying it so far."
B: "That is great to hear! Let me know if you need any help."',
    1,
    '2025-12-11 08:00:00+00'
  ),
  (
    'f0000019-0000-0000-0000-000000000019',
    'e0000008-0000-0000-0000-000000000008',
    'Numbers, Dates, and Telling the Time',
    'This lesson covers the essential vocabulary for talking about numbers, dates, and time in everyday English.

**Cardinal Numbers (counting):**
1–10: one, two, three, four, five, six, seven, eight, nine, ten
11–20: eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty
21+: twenty-one, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred
1,000 = one thousand | 1,000,000 = one million

**Ordinal Numbers (order/dates):**
1st = first | 2nd = second | 3rd = third | 4th = fourth | 5th = fifth
6th–20th: sixth, seventh, eighth, ninth, tenth, eleventh...
21st = twenty-first | 30th = thirtieth | 100th = one hundredth

**Dates:**
Written: 15 March 2026 OR March 15, 2026
Spoken: "the fifteenth of March, twenty twenty-six"
British: day/month/year → 15/03/2026
American: month/day/year → 03/15/2026

**Telling the Time:**
- 3:00 = three o''clock
- 3:15 = quarter past three
- 3:30 = half past three
- 3:45 = quarter to four
- 3:10 = ten past three
- 3:50 = ten to four

AM (midnight to noon) vs PM (noon to midnight)
"The class starts at 9 AM and finishes at 11:30 AM."

**Asking the Time:**
- "What time is it?" / "Do you have the time?"
- "What time does the class start?" — "It starts at half past nine."',
    2,
    '2025-12-11 08:00:00+00'
  )

ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 6: ACTIVITIES
-- =============================================================================

INSERT INTO activities (id, lesson_id, title, type, exam_target, instructions, time_limit, created_at)
VALUES

  -- ── Course 1: IELTS Writing Activities ────────────────────────────────────

  -- Activity 1: Bar Chart (Mobile Phones) — in lesson "Describing Bar Charts"
  (
    'a0000001-0000-0000-0000-000000000001',
    'f0000004-0000-0000-0000-000000000004',
    'Bar Chart: Mobile Phone Usage by Age Group',
    'essay',
    'task_1',
    'The bar chart below shows the percentage of people in four age groups (18–24, 25–34, 35–49, 50+) who owned and regularly used a mobile phone in 2020. The data is sourced from a national telecommunications survey.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words. You should spend about 20 minutes on this task.',
    20,
    '2025-12-02 09:00:00+00'
  ),

  -- Activity 2: Opinion Essay (Technology) — in lesson "Opinion Essays"
  (
    'a0000002-0000-0000-0000-000000000002',
    'f0000007-0000-0000-0000-000000000007',
    'Technology and Modern Life',
    'essay',
    'task_2',
    'Some people believe that technology has made people''s lives more complicated. Others believe that technology has made life simpler and more convenient.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words. You should spend about 40 minutes on this task.',
    40,
    '2025-12-03 09:00:00+00'
  ),

  -- Activity 3: Line Graph (Internet Users) — in lesson "Describing Line Graphs"
  (
    'a0000003-0000-0000-0000-000000000003',
    'f0000005-0000-0000-0000-000000000005',
    'Line Graph: Internet Users by Country (2000–2020)',
    'essay',
    'task_1',
    'The line graph below shows the number of internet users (in millions) in five countries — the USA, China, India, Brazil, and Japan — from 2000 to 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words. You should spend about 20 minutes on this task.',
    20,
    '2025-12-02 10:00:00+00'
  ),

  -- Activity 4: Discussion Essay (Environmental Problems) — in lesson "Discussion Essays"
  (
    'a0000004-0000-0000-0000-000000000004',
    'f0000008-0000-0000-0000-000000000008',
    'Environmental Problems: Individual vs Global Responsibility',
    'essay',
    'task_2',
    'Environmental problems such as climate change, deforestation, and ocean pollution are too big for individual countries to solve on their own. International cooperation is the only effective solution.

To what extent do you agree or disagree?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words. You should spend about 40 minutes on this task.',
    40,
    '2025-12-03 10:00:00+00'
  ),

  -- Activity 5: Bar Chart (Energy Sources) — in lesson "Describing Bar Charts"
  (
    'a0000005-0000-0000-0000-000000000005',
    'f0000004-0000-0000-0000-000000000004',
    'Bar Chart: Energy Production by Source in Three Countries',
    'essay',
    'task_1',
    'The bar chart below shows the percentage of total energy produced from five different sources — coal, natural gas, nuclear, hydroelectric, and renewables — in France, Australia, and Brazil in 2022.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words. You should spend about 20 minutes on this task.',
    20,
    '2025-12-02 11:00:00+00'
  ),

  -- Activity 6: Problem-Solution Essay (Traffic) — in lesson "Problem-Solution Essays"
  (
    'a0000006-0000-0000-0000-000000000006',
    'f0000009-0000-0000-0000-000000000009',
    'Urban Traffic Congestion: Causes and Solutions',
    'essay',
    'task_2',
    'Traffic congestion is becoming an increasingly serious problem in many of the world''s major cities.

What are the main causes of this problem? What measures could be taken to address it?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words. You should spend about 40 minutes on this task.',
    40,
    '2025-12-03 11:00:00+00'
  ),

  -- ── Course 2: IELTS Speaking Activities ───────────────────────────────────

  -- Activity 7: Speaking Part 1 Practice
  (
    'a0000007-0000-0000-0000-000000000007',
    'f0000010-0000-0000-0000-000000000010',
    'Part 1 Mock: Home, Hobbies, and Daily Life',
    'speaking',
    'part_1',
    'Record yourself answering the following IELTS Speaking Part 1 questions. Aim for 2–3 sentences per answer. Speak naturally — do not read from a script.

Questions:
1. Where are you from originally? What do you like most about your hometown?
2. Do you work or are you a student? What do you enjoy most about it?
3. What do you like to do in your free time?
4. How do you usually get to school or work?
5. Do you prefer spending time indoors or outdoors? Why?

Record your responses and upload the audio file. Your teacher will provide feedback on your Fluency, Vocabulary, Grammar, and Pronunciation.',
    10,
    '2025-12-05 09:00:00+00'
  ),

  -- Activity 8: Speaking Part 2 Cue Card
  (
    'a0000008-0000-0000-0000-000000000008',
    'f0000012-0000-0000-0000-000000000012',
    'Part 2 Cue Card: Describe a Place You Have Visited',
    'speaking',
    'part_2',
    'You have 1 minute to prepare and then 1–2 minutes to speak on the following cue card.

Describe a place you have visited that you found particularly interesting or beautiful.

You should say:
- where this place is
- when you visited it and who you went with
- what you did there
- and explain why this place made such a strong impression on you

Record your response (including the preparation time if possible) and upload the file. Try to speak for the full 1–2 minutes without stopping.',
    15,
    '2025-12-06 09:00:00+00'
  ),

  -- ── Course 3: General English Activities ──────────────────────────────────

  -- Activity 9: Grammar Quiz (Present Tenses)
  (
    'a0000009-0000-0000-0000-000000000009',
    'f0000016-0000-0000-0000-000000000016',
    'Present Tenses: Fill in the Gaps Quiz',
    'quiz',
    NULL,
    'Choose the correct form (Present Simple or Present Continuous) to complete each sentence.

1. Water _____ (boil) at 100 degrees Celsius.
2. Listen! Someone _____ (knock) at the door.
3. I _____ (study) English at Jaxtina LMS this year.
4. She usually _____ (walk) to school but today she _____ (take) the bus.
5. They _____ (not/understand) the question. Can you explain it again?
6. The children _____ (play) in the park right now.
7. My father _____ (work) as a doctor.
8. Where _____ you _____ (go) at the moment?
9. He _____ (speak) three languages fluently.
10. We _____ (have) a grammar test tomorrow so I _____ (revise) my notes now.

Write your answers and submit below. You will receive corrections and explanations.',
    15,
    '2025-12-10 09:00:00+00'
  ),

  -- Activity 10: Vocabulary Quiz (Greetings)
  (
    'a0000010-0000-0000-0000-000000000010',
    'f0000018-0000-0000-0000-000000000018',
    'Everyday English: Greetings and Introductions Quiz',
    'quiz',
    NULL,
    'Match the English phrase (A–J) with its most appropriate situation (1–10). Write only the letter.

A. "How do you do?"
B. "Nice to meet you!"
C. "Long time no see!"
D. "How is it going?"
E. "Have a good evening!"
F. "Take care!"
G. "What''s up?"
H. "Good morning."
I. "It was a pleasure meeting you."
J. "See you tomorrow!"

Situations:
1. You arrive at the office at 9am and greet your manager.
2. You are introduced to someone at a formal business dinner for the first time.
3. You bump into a friend you have not seen for six months.
4. You are saying goodbye to a close friend after hanging out.
5. You meet a colleague''s visiting client for the first time (very formal).
6. You are leaving work at the end of the day and saying goodbye to your team.
7. You ask a close friend casually how they are doing.
8. You say goodbye to a business contact after a meeting.
9. You are leaving school and will see your classmates the next day.
10. You greet a friend and ask how things are in a relaxed, informal way.',
    10,
    '2025-12-11 09:00:00+00'
  )

ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 7: CLASSES
-- =============================================================================

INSERT INTO classes (id, course_id, class_name, schedule, is_active, teacher_id, start_date, end_date, max_students, status, created_at)
VALUES
  -- Class 1: IELTS Writing
  (
    '10000001-0000-0000-0000-000000000001',
    'd0000001-0000-0000-0000-000000000001',
    'IELTS Writing — Mon/Wed/Fri Morning',
    'Monday, Wednesday, Friday — 8:00 AM to 9:30 AM',
    TRUE,
    'b0000001-0000-0000-0000-000000000001',
    '2026-01-06',
    '2026-06-30',
    15,
    'active',
    '2025-12-15 08:00:00+00'
  ),
  -- Class 2: IELTS Speaking
  (
    '10000002-0000-0000-0000-000000000002',
    'd0000002-0000-0000-0000-000000000002',
    'IELTS Speaking — Tue/Thu Afternoon',
    'Tuesday, Thursday — 2:00 PM to 3:30 PM',
    TRUE,
    'b0000001-0000-0000-0000-000000000001',
    '2026-01-07',
    '2026-06-30',
    12,
    'active',
    '2025-12-15 08:30:00+00'
  ),
  -- Class 3: General English
  (
    '10000003-0000-0000-0000-000000000003',
    'd0000003-0000-0000-0000-000000000003',
    'General English Foundation — Morning Class',
    'Monday to Friday — 9:00 AM to 10:30 AM',
    TRUE,
    'b0000002-0000-0000-0000-000000000002',
    '2026-02-01',
    '2026-07-31',
    20,
    'active',
    '2026-01-10 08:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 8: CLASS_TEACHERS
-- =============================================================================

INSERT INTO class_teachers (id, class_id, teacher_id, assigned_at)
VALUES
  (
    '20000001-0000-0000-0000-000000000001',
    '10000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    '2025-12-15 08:00:00+00'
  ),
  (
    '20000002-0000-0000-0000-000000000002',
    '10000002-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000001',
    '2025-12-15 08:30:00+00'
  ),
  (
    '20000003-0000-0000-0000-000000000003',
    '10000003-0000-0000-0000-000000000003',
    'b0000002-0000-0000-0000-000000000002',
    '2026-01-10 08:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 9: CLASS_ENROLMENTS
-- =============================================================================

INSERT INTO class_enrolments (id, class_id, student_id, enrolled_at)
VALUES
  -- Class 1 (IELTS Writing): learner1–5
  (
    '30000001-0000-0000-0000-000000000001',
    '10000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    '2026-01-06 08:00:00+00'
  ),
  (
    '30000002-0000-0000-0000-000000000002',
    '10000001-0000-0000-0000-000000000001',
    'c0000002-0000-0000-0000-000000000002',
    '2026-01-06 08:05:00+00'
  ),
  (
    '30000003-0000-0000-0000-000000000003',
    '10000001-0000-0000-0000-000000000001',
    'c0000003-0000-0000-0000-000000000003',
    '2026-01-06 08:10:00+00'
  ),
  (
    '30000004-0000-0000-0000-000000000004',
    '10000001-0000-0000-0000-000000000001',
    'c0000004-0000-0000-0000-000000000004',
    '2026-01-06 08:15:00+00'
  ),
  (
    '30000005-0000-0000-0000-000000000005',
    '10000001-0000-0000-0000-000000000001',
    'c0000005-0000-0000-0000-000000000005',
    '2026-01-06 08:20:00+00'
  ),
  -- Class 2 (IELTS Speaking): learner1, 6, 7, 8
  (
    '30000006-0000-0000-0000-000000000006',
    '10000002-0000-0000-0000-000000000002',
    'c0000001-0000-0000-0000-000000000001',
    '2026-01-07 14:00:00+00'
  ),
  (
    '30000007-0000-0000-0000-000000000007',
    '10000002-0000-0000-0000-000000000002',
    'c0000006-0000-0000-0000-000000000006',
    '2026-01-07 14:05:00+00'
  ),
  (
    '30000008-0000-0000-0000-000000000008',
    '10000002-0000-0000-0000-000000000002',
    'c0000007-0000-0000-0000-000000000007',
    '2026-01-07 14:10:00+00'
  ),
  (
    '30000009-0000-0000-0000-000000000009',
    '10000002-0000-0000-0000-000000000002',
    'c0000008-0000-0000-0000-000000000008',
    '2026-01-07 14:15:00+00'
  ),
  -- Class 3 (General English): learner9, 10, 3, 5
  (
    '30000010-0000-0000-0000-000000000010',
    '10000003-0000-0000-0000-000000000003',
    'c0000009-0000-0000-0000-000000000009',
    '2026-02-01 09:00:00+00'
  ),
  (
    '30000011-0000-0000-0000-000000000011',
    '10000003-0000-0000-0000-000000000003',
    'c0000010-0000-0000-0000-000000000010',
    '2026-02-01 09:05:00+00'
  ),
  (
    '30000012-0000-0000-0000-000000000012',
    '10000003-0000-0000-0000-000000000003',
    'c0000003-0000-0000-0000-000000000003',
    '2026-02-01 09:10:00+00'
  ),
  (
    '30000013-0000-0000-0000-000000000013',
    '10000003-0000-0000-0000-000000000003',
    'c0000005-0000-0000-0000-000000000005',
    '2026-02-01 09:15:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 10: SUBMISSIONS
-- =============================================================================

INSERT INTO submissions (id, activity_id, student_id, status, content, submitted_at)
VALUES

  -- ── Learner 1 (Pham Thi Thu) ──────────────────────────────────────────────

  -- Submission 1: Bar Chart Mobile Phones (graded, Band 6.0)
  (
    '40000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'graded',
    'The bar chart illustrates the percentage of people across four age groups who owned and regularly used a mobile phone in 2020.

Overall, it is clear that younger age groups had significantly higher mobile phone usage than older groups, with the 18–24 age group recording the highest proportion of users. The 50+ age group showed the lowest usage rate throughout the period.

In terms of the youngest cohort, approximately 95% of people aged 18–24 used mobile phones, making it by far the most connected group. This was closely followed by the 25–34 age group, at around 89%. Both groups showed consistently high levels of mobile adoption.

In contrast, the older age groups showed considerably lower rates. The 35–49 group recorded usage of roughly 74%, while the 50+ category had the lowest figure at approximately 52%. Despite this, it is notable that even among the oldest cohort, over half of the population were regular mobile phone users, indicating the widespread adoption of this technology across all demographics.

To summarise, mobile phone usage in 2020 was highest among young adults and declined with age, though it remained relatively common even among older populations.',
    '2026-01-15 10:30:00+00'
  ),

  -- Submission 2: Technology Essay Task 2 (graded, Band 5.5)
  (
    '40000002-0000-0000-0000-000000000002',
    'a0000002-0000-0000-0000-000000000002',
    'c0000001-0000-0000-0000-000000000001',
    'graded',
    'Technology has changed many aspects of our daily lives. Some people think it make life more complicated but others believe it make life easier. In this essay, I will discuss both views and give my own opinion.

On the one hand, some people think technology make life harder. For example, we must use many different apps and devices every day. We have smartphone, laptop, smart TV and many other devices. This can confuse people who do not understand technology very well. Old people especially have difficult to learn new technology. Furthermore, technology cause us to be more dependent. If our phone die or the internet is broken, we cannot do many things.

On the other hand, many people believe technology make life more simple and convenient. For example, we can order food, shop for clothes, and pay bills from our phone without leaving home. This save a lot of time and effort. Also, we can communicate with people all over the world for free using apps like Zalo and Messenger. Before technology, this was impossible or very expensive.

In my opinion, I think technology has made life more convenient overall. Although there can be problems sometimes, the benefits are much bigger than the disadvantages. People just need to learn how to use technology correctly and carefully.

In conclusion, while some people find technology complicated, I believe it mostly makes our lives easier and more connected. Technology will continue to develop and we should embrace it.',
    '2026-01-22 14:15:00+00'
  ),

  -- Submission 3: Environmental Problems Essay (submitted, awaiting marking)
  (
    '40000003-0000-0000-0000-000000000003',
    'a0000004-0000-0000-0000-000000000004',
    'c0000001-0000-0000-0000-000000000001',
    'submitted',
    'Environmental problems such as climate change, pollution, and deforestation are major issues facing the world today. The question is whether these problems are too large for individual nations to address alone, and whether international cooperation is the only effective solution. I strongly agree with this statement.

Firstly, environmental issues do not respect national borders. Air pollution produced in one country can travel thousands of kilometres and affect the air quality of neighbouring nations. Similarly, carbon dioxide emissions released anywhere in the world contribute to the global rise in temperatures. It is therefore impossible for individual countries to solve these problems unilaterally, no matter how committed their policies are.

Secondly, large-scale environmental action requires enormous financial and technological resources that most individual countries cannot provide alone. Developing nations in particular often lack the funds to invest in clean energy infrastructure. International agreements such as the Paris Climate Accord allow wealthy nations to support developing countries through funding and technology transfer, creating a more equitable and effective response.

However, it is also important to acknowledge that international cooperation alone is not sufficient without genuine commitment from individual governments. History has shown that many countries sign agreements but fail to meet their targets. Therefore, strong national policies must work in parallel with global frameworks to achieve meaningful results.

In conclusion, while national action is necessary, I believe that environmental problems are fundamentally global in nature and can only be effectively addressed through sustained international cooperation and shared responsibility.',
    '2026-02-10 09:45:00+00'
  ),

  -- ── Learner 2 (Hoang Van Duc) ─────────────────────────────────────────────

  -- Submission 1: Bar Chart Mobile Phones (graded, Band 6.5)
  (
    '40000004-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000001',
    'c0000002-0000-0000-0000-000000000002',
    'graded',
    'The provided bar chart shows the proportion of mobile phone users in four different age demographics in 2020, drawing from a national telecommunications survey.

Overall, a clear trend is evident: mobile phone usage decreases as age increases. The youngest age group demonstrated the highest ownership rates, while the oldest cohort showed the lowest, though usage remained substantial across all groups.

Looking at the data in more detail, the 18–24 age group showed the highest mobile phone usage, at approximately 95%. This figure was only marginally lower for the 25–34 bracket, which stood at around 88–89%. These two groups were remarkably similar, suggesting that mobile phones are near-universal among working-age young adults.

The 35–49 cohort recorded a noticeably lower rate of approximately 73–75%, indicating that usage begins to decline in middle age. The most striking gap, however, was in the 50+ group, where only around half the population — roughly 50–53% — were regular users. Despite this, it is significant that even among older adults, the majority owned and used a mobile phone, reflecting the broad penetration of mobile technology across all demographics by 2020.',
    '2026-01-16 11:00:00+00'
  ),

  -- Submission 2: Technology Essay (under_review)
  (
    '40000005-0000-0000-0000-000000000005',
    'a0000002-0000-0000-0000-000000000002',
    'c0000002-0000-0000-0000-000000000002',
    'under_review',
    'The rapid advancement of technology in recent decades has fundamentally altered the fabric of modern life. While a minority argue that these changes have introduced unnecessary complexity, the overwhelming evidence suggests that technology has been a powerful force for simplification and greater convenience in almost every domain of human activity.

Proponents of the view that technology complicates life often point to the cognitive overload caused by the sheer number of digital tools available today. Managing multiple platforms, subscriptions, and devices can create a sense of fragmentation. Moreover, the expectation of constant connectivity has blurred the boundaries between work and personal life, generating new forms of stress that previous generations did not face.

Nevertheless, I believe the counterarguments are considerably more persuasive. Technology has dramatically streamlined processes that once required significant time and effort. Online banking, e-commerce, and digital communication have eliminated numerous bureaucratic steps from everyday life. A task that might have required a trip to a government office and hours of waiting can now be completed via smartphone in minutes. Furthermore, services such as GPS navigation, instant translation, and remote healthcare have enhanced accessibility for people across all socioeconomic backgrounds.

In conclusion, although technology introduces certain complexities — particularly for those less familiar with digital tools — I firmly believe that its net effect on modern life is overwhelmingly positive. The key lies in digital literacy education to ensure that all members of society can harness the full potential of available technologies.',
    '2026-02-05 16:30:00+00'
  ),

  -- ── Learner 3 (Nguyen Thi Mai) ────────────────────────────────────────────

  -- Submission 1: Bar Chart Mobile Phones (submitted, not yet marked)
  (
    '40000006-0000-0000-0000-000000000006',
    'a0000001-0000-0000-0000-000000000001',
    'c0000003-0000-0000-0000-000000000003',
    'submitted',
    'The bar chart shows information about how many percent of people in different ages use mobile phones in 2020.

As can be seen from the chart, young people use mobile phone more than old people. The highest percentage is 18–24 age group with about 95 percent. After that is 25–34 group with around 89 percent.

The 35–49 group has lower usage which is about 74 percent. The lowest group is people who are 50 and older, with about 52 percent of them using mobile phone. But this is still more than half so we can say that mobile phone is popular for all age group.

In conclusion, the chart shows that mobile phone usage is very high among young people and become lower as age increase. However all age group still show that more than half of people are using mobile phone in 2020.',
    '2026-02-12 10:00:00+00'
  ),

  -- ── Learner 5 (Do Thi Hoa) ────────────────────────────────────────────────

  -- Submission 1: Bar Chart Energy Sources (graded, Band 5.0)
  (
    '40000007-0000-0000-0000-000000000007',
    'a0000005-0000-0000-0000-000000000005',
    'c0000005-0000-0000-0000-000000000005',
    'graded',
    'The bar chart shows the percentage of energy from five different sources in France, Australia and Brazil in 2022.

Overall, it can see that different countries have very different ways to produce energy. France use most nuclear energy, Australia use most coal, and Brazil use most hydroelectric power.

France produce about 70% energy from nuclear power. This is much higher than other countries. France also have small amount from natural gas (about 8%) and renewables (about 12%). Coal is very low in France.

Australia is very different from France. Australia mainly use coal for energy, which is around 55–60%. Natural gas is second at about 22%. Renewables in Australia is only small, around 10–12%. Nuclear power is zero in Australia.

Brazil is interesting country because it use mostly hydroelectric power (about 60–65%). This is very green energy. Renewables also high in Brazil at around 20%. Coal and nuclear very low. This show Brazil has clean energy compared to Australia.

In conclusion, France depend on nuclear, Australia depend on coal, and Brazil depend on water for energy. This show different energy strategy in each country.',
    '2026-01-20 12:00:00+00'
  ),

  -- ── Learner 4 (Vo Van Tuan) — no submissions (new student) ───────────────
  -- No insert required — learner4 has no submissions.

  -- ── Learner 1 additional: Line Graph (draft, not submitted) ───────────────
  (
    '40000008-0000-0000-0000-000000000008',
    'a0000003-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000001',
    'draft',
    'Draft notes — need to finish this one before class on Friday. Key points: China fastest growth, USA already high at start. India overtook Japan by 2015 approximately.',
    '2026-02-18 20:00:00+00'
  ),

  -- ── Learner 6 (Bui Van Nam) — Speaking Part 1 submission ─────────────────
  (
    '40000009-0000-0000-0000-000000000009',
    'a0000007-0000-0000-0000-000000000007',
    'c0000006-0000-0000-0000-000000000006',
    'submitted',
    'Audio file uploaded via the Jaxtina LMS portal. Duration: 3 minutes 42 seconds. Answers cover hometown (Da Nang), current studies (English at Jaxtina), hobbies (football and gaming), daily commute (motorbike), and preference for outdoor activities.',
    '2026-01-28 15:30:00+00'
  )

ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 11: SCORES
-- =============================================================================

INSERT INTO scores (id, submission_id, teacher_id, score, max_score, marked_at)
VALUES
  -- Learner 1, Submission 1 (Bar Chart Mobile Phones) — Band 6.0
  (
    '50000001-0000-0000-0000-000000000001',
    '40000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    6.0,
    9,
    '2026-01-16 09:00:00+00'
  ),
  -- Learner 1, Submission 2 (Technology Essay) — Band 5.5
  (
    '50000002-0000-0000-0000-000000000002',
    '40000002-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000001',
    5.5,
    9,
    '2026-01-23 10:00:00+00'
  ),
  -- Learner 2, Submission 1 (Bar Chart Mobile Phones) — Band 6.5
  (
    '50000003-0000-0000-0000-000000000003',
    '40000004-0000-0000-0000-000000000004',
    'b0000001-0000-0000-0000-000000000001',
    6.5,
    9,
    '2026-01-18 11:00:00+00'
  ),
  -- Learner 5, Submission 1 (Bar Chart Energy Sources) — Band 5.0
  (
    '50000004-0000-0000-0000-000000000004',
    '40000007-0000-0000-0000-000000000007',
    'b0000001-0000-0000-0000-000000000001',
    5.0,
    9,
    '2026-01-22 09:30:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SECTION 12: FEEDBACK
-- =============================================================================

INSERT INTO feedback (id, submission_id, teacher_id, content, is_visible, created_at)
VALUES

  -- Feedback for Learner 1, Submission 1 (Bar Chart Mobile Phones, Band 6.0)
  (
    '60000001-0000-0000-0000-000000000001',
    '40000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    '{"overallBand": 6.0, "TA": 6.0, "CC": 5.5, "LR": 6.0, "GRA": 6.0, "keyImprovements": ["Use more varied vocabulary to describe trends — try synonyms such as ''surge'', ''plateau'', or ''bottom out'' instead of repeating ''increase'' and ''decrease''", "Strengthen your overview paragraph by clearly stating the most significant overall trend without including specific data figures", "Improve the organisation of your body paragraphs — group related data together more deliberately and use clearer transitions between comparisons"], "overall_feedback": "Good attempt, Thu! Your writing clearly identifies the key trends in the data and your description is accurate overall. Your introduction is well-paraphrased and your overview correctly identifies the main pattern. To push towards Band 7, focus on using a wider range of vocabulary to describe data movements, and work on making your paragraph structure more cohesive. Try to avoid starting multiple sentences with the same structure — vary your sentence openings to show more grammatical range."}',
    TRUE,
    '2026-01-16 09:30:00+00'
  ),

  -- Feedback for Learner 1, Submission 2 (Technology Essay, Band 5.5)
  (
    '60000002-0000-0000-0000-000000000002',
    '40000002-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000001',
    '{"overallBand": 5.5, "TA": 5.5, "CC": 5.5, "LR": 5.5, "GRA": 5.5, "keyImprovements": ["Develop your body paragraphs more fully — each paragraph needs a clear topic sentence, at least one well-explained reason, and a specific, concrete example", "Check subject-verb agreement carefully, especially with third-person singular (''technology makes'', not ''technology make'')", "Use a wider range of cohesive devices — you overuse ''also'' and ''furthermore''; try ''consequently'', ''as a result'', ''in addition to this'', or ''this in turn''"], "overall_feedback": "You have addressed the main question and discussed both views, which is positive. However, your arguments need to be developed more fully. At Band 5.5, ideas are present but often lack the depth and specific examples needed for higher bands. For instance, instead of saying ''we must use many different apps'', try to explain why this specifically causes problems and support it with a real-world example. Also please review your grammar — there are several subject-verb agreement errors throughout the essay that lower your Grammatical Range and Accuracy score. Keep practising — you are making good progress!"}',
    TRUE,
    '2026-01-23 10:30:00+00'
  ),

  -- Feedback for Learner 2, Submission 1 (Bar Chart Mobile Phones, Band 6.5)
  (
    '60000003-0000-0000-0000-000000000003',
    '40000004-0000-0000-0000-000000000004',
    'b0000001-0000-0000-0000-000000000001',
    '{"overallBand": 6.5, "TA": 6.5, "CC": 6.0, "LR": 6.5, "GRA": 7.0, "keyImprovements": ["Expand your overview statement — it should highlight the single most important overall trend clearly and concisely without numerical data", "Make more direct data comparisons in your body paragraphs using precise comparative structures (e.g., ''The 18–24 group recorded a usage rate nearly double that of the 50+ cohort'')", "Introduce more specific hedging language when exact figures are not given (e.g., ''approximately'', ''just under'', ''slightly above'')"], "overall_feedback": "Very strong work, Duc! Your grammar is a clear strength — you use a variety of complex sentence structures accurately, which is excellent for Band 7. Your vocabulary is appropriately academic and you have paraphrased the task well. The main area for improvement is your overview: it is slightly too brief and does not fully capture the key comparison between the youngest and oldest groups. Your body paragraphs are well-organised and you select relevant data, but could include even more precise comparisons. You are very close to Band 7 — keep it up!"}',
    TRUE,
    '2026-01-18 11:30:00+00'
  ),

  -- Feedback for Learner 5, Submission 1 (Bar Chart Energy Sources, Band 5.0)
  (
    '60000004-0000-0000-0000-000000000004',
    '40000007-0000-0000-0000-000000000007',
    'b0000001-0000-0000-0000-000000000001',
    '{"overallBand": 5.0, "TA": 5.0, "CC": 5.0, "LR": 5.0, "GRA": 5.0, "keyImprovements": ["Write a proper overview paragraph — identify the 2–3 most significant overall features across ALL countries before going into detail", "Avoid conversational or informal phrases (e.g., ''interesting country'', ''very green energy'', ''this show'') — use academic language throughout", "Work on grammatical accuracy: review subject-verb agreement, articles (''a'', ''the''), and tense consistency throughout your response"], "overall_feedback": "Hoa, you have identified the key feature of each country correctly, which shows you understand how to read bar charts. However, at Band 5, the response needs a clearer structure with a distinct Overview paragraph before you begin describing individual countries. Your language is also quite informal in places, which reduces your Lexical Resource score. The most important priority for you is to practise academic vocabulary for data description — please review the vocabulary list in Module 1, Lesson 2 and try to apply at least 5 new trend words in your next submission. I can see you are working hard and I believe with focused practice you will improve quickly!"}',
    TRUE,
    '2026-01-22 10:00:00+00'
  ),

  -- Internal (not visible) AI draft feedback for Learner 1, Submission 3 (Environmental Essay — submitted)
  -- This simulates an AI draft that the teacher has not yet reviewed/published
  (
    '60000005-0000-0000-0000-000000000005',
    '40000003-0000-0000-0000-000000000003',
    'b0000001-0000-0000-0000-000000000001',
    '{"source": "ai_draft", "overallBand": 6.5, "TA": 7.0, "CC": 6.5, "LR": 6.5, "GRA": 6.0, "keyImprovements": ["Strengthen the concession paragraph — acknowledge that national action has value but be more specific about its limitations", "Vary sentence openings in body paragraphs — several sentences begin with ''Firstly'' and ''Furthermore'' in close proximity", "Check use of articles: ''the Paris Climate Accord'' is correct but review other instances where articles may be missing or incorrect"], "overall_feedback": "[AI DRAFT — Teacher review required before publishing] This is a well-structured and clearly argued essay. Task Achievement is strong: the student states a clear position, addresses the nuances of the topic, and maintains their stance throughout. The reference to the Paris Climate Accord as a concrete example is effective. To reach Band 7, the student should develop more sophisticated vocabulary choices (e.g., replacing ''big'' with ''formidable'' or ''overwhelming'') and increase the variety of complex grammatical structures. The concession paragraph is a good inclusion but could be more specifically developed."}',
    FALSE,
    '2026-02-10 10:00:00+00'
  )

ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- END OF SEED
-- =============================================================================
-- Summary of inserted data:
--   auth.users:         12 rows (1 admin, 2 teachers, 10 learners)
--   user_profiles:      12 rows
--   courses:             3 rows
--   modules:             8 rows
--   lessons:            19 rows
--   activities:         10 rows
--   classes:             3 rows
--   class_teachers:      3 rows
--   class_enrolments:   13 rows
--   submissions:         9 rows
--   scores:              4 rows
--   feedback:            5 rows (4 visible, 1 internal AI draft)
-- =============================================================================

COMMIT;
