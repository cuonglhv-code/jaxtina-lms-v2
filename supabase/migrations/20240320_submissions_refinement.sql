-- 1. Add Status to Submissions
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted' 
CHECK (status IN ('draft', 'submitted', 'under_review', 'graded'));

-- 2. Expand Submissions RLS
CREATE POLICY "Students can submit their own work" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own drafts" ON submissions
  FOR UPDATE USING (auth.uid() = student_id AND status = 'draft');

-- 3. Define Scores RLS
CREATE POLICY "Students view own scores" ON scores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM submissions WHERE id = scores.submission_id AND student_id = auth.uid())
  );

CREATE POLICY "Teachers/Admins manage scores" ON scores
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) 
    IN ('teacher', 'super_admin', 'centre_admin', 'academic_admin')
  );

-- 4. Define Feedback RLS
CREATE POLICY "Students view visible feedback" ON feedback
  FOR SELECT USING (
    is_visible = true AND 
    EXISTS (SELECT 1 FROM submissions WHERE id = feedback.submission_id AND student_id = auth.uid())
  );

CREATE POLICY "Teachers/Admins manage feedback" ON feedback
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) 
    IN ('teacher', 'super_admin', 'centre_admin', 'academic_admin')
  );

-- 5. AI Feedback Logs (Allow system insertion)
CREATE POLICY "Allow system to log AI feedback" ON ai_feedback_logs
  FOR INSERT WITH CHECK (true);
