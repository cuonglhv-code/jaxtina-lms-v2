'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateUserRole(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    throw new Error('Unauthorized: Admin role required');
  }

  const userId = formData.get('user_id') as string;
  const role = formData.get('role') as string;

  if (!userId || !role) throw new Error('Missing user_id or role');

  const VALID_ROLES = ['learner', 'teacher', 'centre_admin', 'academic_admin', 'super_admin'];
  if (!VALID_ROLES.includes(role)) throw new Error('Invalid role value');

  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw new Error(`Failed to update role: ${error.message}`);

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}`);
  redirect('/admin/users');
}
