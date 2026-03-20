import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CreateClassForm } from './CreateClassForm';

type CourseOption = { id: string; title: string };
type TeacherOption = { id: string; full_name: string };

export default async function NewClassPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const [{ data: courses }, { data: teachers }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title')
      .eq('is_published', true)
      .order('title'),
    supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('role', 'teacher')
      .order('full_name'),
  ]);

  return (
    <CreateClassForm
      courses={(courses ?? []) as CourseOption[]}
      teachers={(teachers ?? []) as TeacherOption[]}
    />
  );
}
