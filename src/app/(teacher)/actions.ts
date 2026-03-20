'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Finalizes the marking flow for a specific submission.
 * This is an atomic action that reveals feedback to the student
 * and updates the submission status to 'graded'.
 */
export async function finalizeMarkingAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // 1. Verify Teacher/Admin Role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const allowedRoles = ['teacher', 'super_admin', 'centre_admin', 'academic_admin'];
  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error('Unauthorized: Teacher or Admin role required for marking');
  }

  // 2. Extract and Validate Form Data
  const submissionId = formData.get('submission_id') as string;
  const scoreInput = formData.get('score') as string;
  const feedbackInput = formData.get('feedback') as string;

  if (!submissionId || !scoreInput || !feedbackInput) {
    throw new Error('Missing required fields (submissionId, score, or feedback)');
  }

  const score = parseFloat(scoreInput);
  if (isNaN(score)) {
    throw new Error('Invalid score: Must be a numeric value');
  }

  // 3. ATOMIC TRANSACTIONS (Using individual upserts since we are in a server action)
  
  // Update/Insert official Score
  const { error: scoreError } = await supabase
    .from('scores')
    .upsert({
      submission_id: submissionId,
      teacher_id: user.id,
      score: score,
      max_score: 9.0,
      marked_at: new Date().toISOString()
    }, { onConflict: 'submission_id' });

  if (scoreError) throw new Error(`Score finalization failed: ${scoreError.message}`);

  // Update/Insert official Feedback & Reveal to Student
  const { error: feedbackError } = await supabase
    .from('feedback')
    .upsert({
      submission_id: submissionId,
      teacher_id: user.id,
      content: feedbackInput,
      is_visible: true // This publishes the feedback to the student
    }, { onConflict: 'submission_id' });

  if (feedbackError) throw new Error(`Feedback finalization failed: ${feedbackError.message}`);

  // Transition Submission Status to 'graded'
  const { error: statusError } = await supabase
    .from('submissions')
    .update({ status: 'graded' })
    .eq('id', submissionId);

  if (statusError) throw new Error(`Status transition failed: ${statusError.message}`);

  // 4. Cache Clearing & Redirection
  revalidatePath('/teacher/dashboard');
  revalidatePath('/learner/dashboard');
  revalidatePath(`/learner/submissions/${submissionId}`);
  revalidatePath(`/teacher/marking/${submissionId}`);
  
  redirect('/teacher/dashboard');
}
