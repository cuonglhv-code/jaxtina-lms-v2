export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { t, type Lang, LEVEL_OPTIONS, SKILL_OPTIONS } from '@/lib/i18n/translations';
import EditCourseForm from './EditCourseForm';

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const lang = ((sp?.lang ?? 'vi') === 'en' ? 'en' : 'vi') as Lang;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, description, level, target_skill, exam_type, is_published')
    .eq('id', id)
    .maybeSingle();

  if (!course) notFound();

  return (
    <EditCourseForm
      course={course}
      lang={lang}
      tr={t[lang]}
      levelOptions={LEVEL_OPTIONS[lang]}
      skillOptions={SKILL_OPTIONS[lang]}
    />
  );
}
