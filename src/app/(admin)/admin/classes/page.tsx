export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n/translations';

type ClassRow = {
  id: string;
  class_name: string;
  course_id: string | null;
  teacher_id: string | null;
  start_date: string | null;
  end_date: string | null;
  max_students: number | null;
  status: string | null;
  is_active: boolean;
  created_at: string;
  courses: { title: string } | null;
  teacher: { full_name: string } | null;
  enrolmentCount: number;
};

function statusBadge(status: string | null) {
  if (status === 'completed') return { backgroundColor: 'var(--border)', color: 'var(--mist)' };
  if (status === 'cancelled') return { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  return { backgroundColor: 'var(--jade-light)', color: 'var(--jade)' };
}

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminClassesPage({
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

  const { data: rawClasses, error } = await supabase
    .from('classes')
    .select(`
      id, class_name, course_id, teacher_id,
      start_date, end_date, max_students, status, is_active, created_at,
      courses(title),
      teacher:teacher_id(full_name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--mist)' }}>Error loading classes.</p>
      </div>
    );
  }

  // Fetch enrollment counts
  const classIds = (rawClasses ?? []).map((c) => c.id);
  let enrolmentMap: Record<string, number> = {};
  if (classIds.length > 0) {
    const { data: enrolments } = await supabase
      .from('class_enrolments')
      .select('class_id')
      .in('class_id', classIds);
    if (enrolments) {
      enrolmentMap = enrolments.reduce<Record<string, number>>((acc, e) => {
        acc[e.class_id] = (acc[e.class_id] ?? 0) + 1;
        return acc;
      }, {});
    }
  }

  type RawClass = {
    id: string;
    class_name: string;
    course_id: string | null;
    teacher_id: string | null;
    start_date: string | null;
    end_date: string | null;
    max_students: number | null;
    status: string | null;
    is_active: boolean;
    created_at: string;
    courses: { title: string } | null;
    teacher: { full_name: string } | null;
  };

  const classes: ClassRow[] = ((rawClasses ?? []) as unknown as RawClass[]).map((c) => ({
    ...c,
    enrolmentCount: enrolmentMap[c.id] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)' }}>
            {tr.classes}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginTop: '4px' }}>
            {classes.length} {lang === 'vi' ? 'lớp học' : 'classes'}
          </p>
        </div>
        <Link
          href="/admin/classes/new"
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
          + {tr.newClass}
        </Link>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
        }}
      >
        {classes.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', color: 'var(--mist)' }}>
            {tr.noClassesFound}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '720px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                  {[tr.className, tr.courses, tr.teacher, tr.startDate, tr.endDate, tr.enrolled, 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--ink)' }}>
                      <Link href={`/admin/classes/${cls.id}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>{cls.class_name}</Link>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{cls.courses?.title ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{cls.teacher?.full_name ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{formatDate(cls.start_date)}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{formatDate(cls.end_date)}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {cls.enrolmentCount}/{cls.max_students ?? 20}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ ...statusBadge(cls.status), padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {cls.status === 'completed' ? tr.completed
                          : cls.status === 'cancelled' ? tr.cancelled
                          : tr.active}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
