-- Add level, target_skill, is_published columns to courses
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS level TEXT,
  ADD COLUMN IF NOT EXISTS target_skill TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
