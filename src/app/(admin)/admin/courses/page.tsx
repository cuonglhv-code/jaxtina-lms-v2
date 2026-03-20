export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n/translations';
import { toggleCourseStatus } from './actions';
import type { Course } from '@/types/database';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang = ((sp?.lang ?? 'vi') === 'en' ? 'en' : 'vi') as Lang;
  const tr = t[lang];

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, description, level, target_skill, is_published, exam_type, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--mist)' }}>Error loading courses.</p>
      </div>
    );
  }

  const rows = (courses ?? []) as Course[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)' }}>
            {tr.courses}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginTop: '4px' }}>
            {rows.length} {lang === 'vi' ? 'khóa học' : 'courses'}
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--jade)',
            color: '#ffffff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          + {tr.newCourse}
        </Link>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            padding: '48px',
            textAlign: 'center',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--mist)',
          }}
        >
          {tr.noCoursesFound}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {rows.map((course) => (
            <div
              key={course.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--card-shadow)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Status + level badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: course.is_published ? 'var(--jade)' : 'var(--border)',
                    color: course.is_published ? '#ffffff' : 'var(--mist)',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {course.is_published ? tr.published : tr.draft}
                </span>
                {course.level && (
                  <span
                    style={{
                      backgroundColor: 'var(--chalk)',
                      color: 'var(--ink)',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {course.level}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: '18px',
                  color: 'var(--midnight)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {course.title}
              </h3>

              {course.description && (
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: 'var(--mist)',
                    margin: 0,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {course.description}
                </p>
              )}

              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)', margin: 0 }}>
                {formatDate(course.created_at)}
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <Link
                  href={`/admin/courses/${course.id}/edit`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                  }}
                >
                  {tr.edit}
                </Link>

                <form action={toggleCourseStatus} style={{ flex: 1 }}>
                  <input type="hidden" name="course_id" value={course.id} />
                  <input type="hidden" name="is_published" value={String(course.is_published ?? false)} />
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: course.is_published ? 'rgba(239,68,68,0.1)' : 'rgba(14,159,110,0.1)',
                      color: course.is_published ? '#ef4444' : 'var(--jade)',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {course.is_published ? tr.unpublish : tr.publish}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
