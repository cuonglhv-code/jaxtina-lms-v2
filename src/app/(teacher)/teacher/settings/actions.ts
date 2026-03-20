'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateTeacherProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  if (id !== user.id) throw new Error('Unauthorized');

  const full_name = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const preferred_lang = formData.get('preferred_lang') as string;

  const { error } = await supabase
    .from('user_profiles')
    .update({
      full_name: full_name || null,
      phone: phone || null,
      preferred_lang: preferred_lang || 'vi',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update profile: ${error.message}`);
  revalidatePath('/teacher/settings');
}

export async function updateTeacherPassword(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const new_password = formData.get('new_password') as string;
  if (!new_password || new_password.length < 8) throw new Error('Password must be at least 8 characters');

  const { error } = await supabase.auth.updateUser({ password: new_password });
  if (error) throw new Error(`Failed to update password: ${error.message}`);
}
