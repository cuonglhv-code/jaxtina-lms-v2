-- Migration: Add updated_at to courses table
-- Description: Ensures sync between database and Course TypeScript interface

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create a trigger to auto-update the timestamp on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_courses_updated_at
        BEFORE UPDATE ON courses
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
