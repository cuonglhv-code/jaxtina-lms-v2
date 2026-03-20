'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    throw new Error('Unauthorized: Admin role required');
  }
  return supabase;
}

export async function createClass(formData: FormData) {
  const supabase = await requireAdmin();

  const class_name = formData.get('class_name') as string;
  const course_id = formData.get('course_id') as string;
  const teacher_id = formData.get('teacher_id') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  const max_students_raw = formData.get('max_students') as string;
  const max_students = max_students_raw ? parseInt(max_students_raw, 10) : 20;

  if (!class_name) throw new Error('Class name is required');

  const { error } = await supabase.from('classes').insert({
    class_name,
    course_id: course_id || null,
    teacher_id: teacher_id || null,
    start_date: start_date || null,
    end_date: end_date || null,
    max_students: isNaN(max_students) ? 20 : max_students,
    status: 'active',
    is_active: true,
  });

  if (error) throw new Error(`Failed to create class: ${error.message}`);

  revalidatePath('/admin/classes');
  redirect('/admin/classes');
}
