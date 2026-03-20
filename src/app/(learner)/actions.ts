'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveDraftAction(activityId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Upsert the draft (either update existing or create new)
  const { error } = await supabase
    .from('submissions')
    .upsert({
      student_id: user.id,
      activity_id: activityId,
      content,
      status: 'draft',
      submitted_at: new Date().toISOString()
    });

  if (error) throw new Error(error.message);
  
  revalidatePath('/learner/dashboard');
  return { success: true };
}

export async function submitEssayAction(activityId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  if (content.trim().length < 50) {
    throw new Error('Submission is too short. Please write more before submitting.');
  }

  const { error } = await supabase
    .from('submissions')
    .upsert({
      student_id: user.id,
      activity_id: activityId,
      content,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    });

  if (error) throw new Error(error.message);

  revalidatePath('/learner/dashboard');
  revalidatePath(`/learner/practice/${activityId}`);
  
  return { success: true };
}
