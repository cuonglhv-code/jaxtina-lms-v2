export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

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
    padding: '2px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    backgroundColor: c.bg,
    color: c.color,
  };
}

function levelBadgeStyle(): React.CSSProperties {
  return {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    backgroundColor: 'var(--chalk)',
    color: 'var(--mist)',
    border: '1px solid var(--border)',
  };
}

type EnrolledCourse = {
  enrolmentId: string;
  classId: string;
  className: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string | null;
  examType: string;
  level: string | null;
  progress: number;
};

export default async function LearnerCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch enrolments → classes → courses
  const { data: enrolments } = await supabase
    .from('class_enrolments')
    .select('id, class_id, classes(id, class_name, course_id, courses(id, title, description, exam_type, level))')
    .eq('student_id', user.id);

  // For each enrolled class, calculate progress: graded submissions / total activities
  const enrolledCourses: EnrolledCourse[] = [];

  for (const e of (enrolments ?? []) as any[]) {
    const cls = e.classes;
    if (!cls) continue;
    const course = cls.courses;
    if (!course) continue;

    // Count total activities in this class's course
    const { count: totalActivities } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .in(
        'lesson_id',
        (await supabase
          .from('lessons')
          .select('id')
          .in(
            'module_id',
            (await supabase
              .from('modules')
              .select('id')
              .eq('course_id', course.id)
            ).data?.map((m: any) => m.id) ?? []
          )
        ).data?.map((l: any) => l.id) ?? []
      );

    // Count graded submissions for this student in this course
    const { count: gradedCount } = await supabase
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', user.id)
      .eq('status', 'graded')
      .in(
        'activity_id',
        (await supabase
          .from('activities')
          .select('id')
          .in(
            'lesson_id',
            (await supabase
              .from('lessons')
              .select('id')
              .in(
                'module_id',
                (await supabase
                  .from('modules')
                  .select('id')
                  .eq('course_id', course.id)
                ).data?.map((m: any) => m.id) ?? []
              )
            ).data?.map((l: any) => l.id) ?? []
          )
        ).data?.map((a: any) => a.id) ?? []
      );

    const total = totalActivities ?? 0;
    const graded = gradedCount ?? 0;
    const progress = total > 0 ? Math.round((graded / total) * 100) : 0;

    enrolledCourses.push({
      enrolmentId: e.id,
      classId: cls.id,
      className: cls.class_name,
      courseId: course.id,
      courseTitle: course.title,
      courseDescription: course.description ?? null,
      examType: course.exam_type ?? 'General English',
      level: course.level ?? null,
      progress,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          My Courses
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          Your enrolled courses and learning progress
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        /* Empty state */
        <div style={{ ...cardStyle, textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--chalk)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <span style={{ fontSize: '28px' }}>⌛</span>
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
            No courses yet
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', maxWidth: '320px', margin: '0 auto' }}>
            Contact your teacher to get enrolled in a course and start your learning journey.
          </p>
        </div>
      ) : (
        /* Course grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {enrolledCourses.map((c) => (
            <div key={c.enrolmentId} style={cardStyle}>
              {/* Course banner */}
              <div style={{ width: '100%', height: '96px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--sand) 0%, var(--chalk) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid var(--border)' }}>
                <BookOpen size={36} style={{ color: 'var(--mist)', opacity: 0.3 }} />
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={examTypeBadgeStyle(c.examType)}>{c.examType}</span>
                {c.level && <span style={levelBadgeStyle()}>{c.level}</span>}
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.3 }}>
                {c.courseTitle}
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)', marginBottom: '16px' }}>
                {c.className}
              </p>

              {/* Progress bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)' }}>Progress</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{c.progress}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--chalk)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, borderRadius: '999px', backgroundColor: c.progress === 100 ? 'var(--jade)' : 'var(--ocean)', transition: 'width 0.6s ease' }} />
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/learner/courses/${c.courseId}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--jade-light)', color: 'var(--jade)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'background-color 0.2s' }}
              >
                Continue Learning
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
