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

export async function toggleCourseStatus(formData: FormData) {
  const supabase = await requireAdmin();

  const courseId = formData.get('course_id') as string;
  const currentStatus = formData.get('is_published') === 'true';

  if (!courseId) throw new Error('Missing course_id');

  const { error } = await supabase
    .from('courses')
    .update({ is_published: !currentStatus })
    .eq('id', courseId);

  if (error) throw new Error(`Failed to update course: ${error.message}`);

  revalidatePath('/admin/courses');
}

export async function createAdminCourse(formData: FormData) {
  const supabase = await requireAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const level = formData.get('level') as string;
  const target_skill = formData.get('target_skill') as string;
  const exam_type = formData.get('exam_type') as string;

  if (!title) throw new Error('Title is required');

  const { error } = await supabase.from('courses').insert({
    title,
    description: description || null,
    level: level || null,
    target_skill: target_skill || null,
    exam_type: exam_type || 'General English',
    is_published: false,
  });

  if (error) throw new Error(`Failed to create course: ${error.message}`);

  revalidatePath('/admin/courses');
  redirect('/admin/courses');
}
