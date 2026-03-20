export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Lock, ChevronRight, BookOpen } from 'lucide-react';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--card-shadow)',
  padding: '24px',
};

function examTypeBadgeStyle(examType: string): React.CSSProperties {
  const colors: Record<string, { bg: string; color: string }> = {
    IELTS: { bg: '#EFF6FF', color: '#2563EB' },
    TOEIC: { bg: '#F0FDF4', color: '#16A34A' },
    'General English': { bg: '#FFF7ED', color: '#EA580C' },
    'Business English': { bg: '#F5F3FF', color: '#7C3AED' },
  };
  const c = colors[examType] ?? { bg: 'var(--chalk)', color: 'var(--mist)' };
  return {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    backgroundColor: c.bg,
    color: c.color,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch the course
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, description, exam_type, level')
    .eq('id', id)
    .maybeSingle();

  if (!course) notFound();

  // Verify learner is enrolled in a class using this course
  const { data: enrolment } = await supabase
    .from('class_enrolments')
    .select('id, class_id, classes(id, class_name, course_id)')
    .eq('student_id', user.id)
    .eq('classes.course_id', id)
    .maybeSingle();

  // Also try a direct join approach as fallback
  let isEnrolled = !!enrolment;
  let enrolledClassName = (enrolment as any)?.classes?.class_name ?? null;

  if (!isEnrolled) {
    // Try fetching classes for this course, then check enrolments
    const { data: classes } = await supabase
      .from('classes')
      .select('id, class_name')
      .eq('course_id', id);

    if (classes && classes.length > 0) {
      const classIds = classes.map((c: any) => c.id);
      const { data: enrolCheck } = await supabase
        .from('class_enrolments')
        .select('id, class_id')
        .eq('student_id', user.id)
        .in('class_id', classIds)
        .maybeSingle();

      if (enrolCheck) {
        isEnrolled = true;
        enrolledClassName = classes.find((c: any) => c.id === enrolCheck.class_id)?.class_name ?? null;
      }
    }
  }

  if (!isEnrolled) {
    redirect('/learner/courses');
  }

  // Fetch modules ordered by order_index
  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, order_index')
    .eq('course_id', id)
    .order('order_index', { ascending: true });

  const moduleIds = (modules ?? []).map((m: any) => m.id);

  // Fetch all lessons for these modules
  const { data: allLessons } = moduleIds.length > 0
    ? await supabase
        .from('lessons')
        .select('id, module_id, title, order_index')
        .in('module_id', moduleIds)
        .order('order_index', { ascending: true })
    : { data: [] };

  const lessonIds = (allLessons ?? []).map((l: any) => l.id);

  // Fetch all activities for these lessons
  const { data: allActivities } = lessonIds.length > 0
    ? await supabase
        .from('activities')
        .select('id, lesson_id')
        .in('lesson_id', lessonIds)
    : { data: [] };

  const activityIds = (allActivities ?? []).map((a: any) => a.id);

  // Fetch learner's submissions for these activities
  const { data: submissions } = activityIds.length > 0
    ? await supabase
        .from('submissions')
        .select('id, activity_id, status')
        .eq('student_id', user.id)
        .in('activity_id', activityIds)
    : { data: [] };

  // Build lookup: lessonId → submission status
  const activityByLesson: Record<string, string[]> = {};
  for (const act of (allActivities ?? []) as any[]) {
    if (!activityByLesson[act.lesson_id]) activityByLesson[act.lesson_id] = [];
    activityByLesson[act.lesson_id].push(act.id);
  }

  const submissionByActivity: Record<string, string> = {};
  for (const sub of (submissions ?? []) as any[]) {
    submissionByActivity[sub.activity_id] = sub.status;
  }

  function getLessonStatus(lessonId: string): 'graded' | 'submitted' | 'none' {
    const acts = activityByLesson[lessonId] ?? [];
    if (acts.length === 0) return 'none';
    const statuses = acts.map((aid) => submissionByActivity[aid]).filter(Boolean);
    if (statuses.includes('graded')) return 'graded';
    if (statuses.length > 0) return 'submitted';
    return 'none';
  }

  // Group lessons by module
  const lessonsByModule: Record<string, any[]> = {};
  for (const lesson of (allLessons ?? []) as any[]) {
    if (!lessonsByModule[lesson.module_id]) lessonsByModule[lesson.module_id] = [];
    lessonsByModule[lesson.module_id].push(lesson);
  }

  const totalLessons = (allLessons ?? []).length;
  const completedLessons = (allLessons ?? []).filter((l: any) => getLessonStatus(l.id) === 'graded').length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Back link */}
      <Link
        href="/learner/courses"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} />
        Back to My Courses
      </Link>

      {/* Course header */}
      <div style={{ ...cardStyle, padding: '32px', background: 'linear-gradient(135deg, var(--midnight) 0%, var(--ocean) 100%)' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ ...examTypeBadgeStyle(course.exam_type ?? 'General English'), backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            {course.exam_type}
          </span>
          {course.level && (
            <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
              {course.level}
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
          {course.title}
        </h1>
        {enrolledClassName && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>
            Class: {enrolledClassName}
          </p>
        )}
        {course.description && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: '600px', marginBottom: '20px' }}>
            {course.description}
          </p>
        )}
        {/* Progress */}
        <div style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
              {completedLessons} / {totalLessons} lessons completed
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
              {progressPct}%
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, borderRadius: '999px', backgroundColor: 'var(--jade)', transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
        {/* Curriculum */}
        <div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--midnight)', marginBottom: '16px' }}>
            Curriculum
          </h2>

          {(modules ?? []).length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
              <BookOpen size={32} style={{ color: 'var(--mist)', opacity: 0.4, margin: '0 auto 12px' }} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
                No curriculum content yet. Check back soon!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(modules ?? []).map((mod: any, modIdx: number) => {
                const lessons = lessonsByModule[mod.id] ?? [];
                return (
                  <div key={mod.id} style={cardStyle}>
                    {/* Module header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--ocean)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#fff' }}>{modIdx + 1}</span>
                      </div>
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                        {mod.title}
                      </h3>
                      <span style={{ marginLeft: 'auto', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)' }}>
                        {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Lessons list */}
                    {lessons.length === 0 ? (
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--mist)', padding: '8px 0' }}>
                        No lessons in this module yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {lessons.map((lesson: any, lessonIdx: number) => {
                          const status = getLessonStatus(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              href={`/learner/lessons/${lesson.id}`}
                              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', backgroundColor: 'transparent', transition: 'background-color 0.15s' }}
                            >
                              {/* Status icon */}
                              <div style={{ flexShrink: 0 }}>
                                {status === 'graded' ? (
                                  <CheckCircle size={18} style={{ color: 'var(--jade)' }} />
                                ) : status === 'none' && lessonIdx > 0 ? (
                                  <Lock size={18} style={{ color: 'var(--mist)', opacity: 0.5 }} />
                                ) : (
                                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status === 'submitted' ? 'var(--ocean)' : 'var(--border)' }} />
                                  </div>
                                )}
                              </div>

                              {/* Lesson number + title */}
                              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)', minWidth: '20px' }}>
                                {lessonIdx + 1}.
                              </span>
                              <span style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '14px',
                                color: status === 'graded' ? 'var(--jade)' : 'var(--ink)',
                                flex: 1,
                                fontWeight: status === 'graded' ? 500 : 400,
                              }}>
                                {lesson.title}
                              </span>

                              {/* Status label */}
                              {status === 'submitted' && (
                                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--ocean)', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '999px' }}>
                                  Under Review
                                </span>
                              )}
                              {status === 'graded' && (
                                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'var(--jade)', backgroundColor: 'var(--jade-light)', padding: '2px 8px', borderRadius: '999px' }}>
                                  Graded
                                </span>
                              )}

                              <ChevronRight size={14} style={{ color: 'var(--mist)', flexShrink: 0 }} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar: course info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px' }}>
              Course Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
              {[
                { label: 'Exam Type', value: course.exam_type ?? '—' },
                { label: 'Level', value: course.level ?? '—' },
                { label: 'Modules', value: String((modules ?? []).length) },
                { label: 'Total Lessons', value: String(totalLessons) },
                { label: 'Completed', value: `${completedLessons} / ${totalLessons}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--mist)' }}>{label}</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress card */}
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '48px', color: progressPct === 100 ? 'var(--jade)' : 'var(--midnight)', lineHeight: 1 }}>
              {progressPct}%
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {progressPct === 100 ? 'Course Complete!' : 'Progress'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
