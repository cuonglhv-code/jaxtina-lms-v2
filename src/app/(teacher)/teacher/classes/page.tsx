export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusBadge(status: string | null): React.CSSProperties {
  if (status === 'completed') return { backgroundColor: 'var(--border)', color: 'var(--mist)' };
  if (status === 'cancelled') return { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  return { backgroundColor: 'var(--jade-light)', color: 'var(--jade)' };
}

function statusLabel(status: string | null) {
  if (status === 'completed') return 'Completed';
  if (status === 'cancelled') return 'Cancelled';
  return 'Active';
}

type ClassRow = {
  id: string;
  class_name: string;
  start_date: string | null;
  end_date: string | null;
  max_students: number | null;
  status: string | null;
  courses: { title: string } | null;
  enrolmentCount: number;
};

export default async function TeacherClassesPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  // Fetch classes where teacher is direct teacher_id
  const { data: directClasses } = await supabase
    .from('classes')
    .select('id, class_name, course_id, start_date, end_date, max_students, status, courses(title)')
    .eq('teacher_id', user.id);

  // Fetch class IDs from class_teachers (many-to-many)
  const { data: classTeacherRows } = await supabase
    .from('class_teachers')
    .select('class_id')
    .eq('teacher_id', user.id);

  const linkedClassIds = (classTeacherRows ?? []).map((r) => r.class_id).filter(Boolean);

  // Fetch those linked classes (avoid duplication by collecting unique IDs)
  const directClassIds = new Set((directClasses ?? []).map((c) => c.id));
  const additionalIds = linkedClassIds.filter((id) => !directClassIds.has(id));

  let linkedClasses: typeof directClasses = [];
  if (additionalIds.length > 0) {
    const { data } = await supabase
      .from('classes')
      .select('id, class_name, course_id, start_date, end_date, max_students, status, courses(title)')
      .in('id', additionalIds);
    linkedClasses = data ?? [];
  }

  type RawClass = {
    id: string;
    class_name: string;
    course_id: string | null;
    start_date: string | null;
    end_date: string | null;
    max_students: number | null;
    status: string | null;
    courses: { title: string } | null;
  };

  const allRawClasses = [
    ...((directClasses ?? []) as unknown as RawClass[]),
    ...((linkedClasses ?? []) as unknown as RawClass[]),
  ];

  // Fetch enrolment counts
  const allClassIds = allRawClasses.map((c) => c.id);
  let enrolmentMap: Record<string, number> = {};
  if (allClassIds.length > 0) {
    const { data: enrolments } = await supabase
      .from('class_enrolments')
      .select('class_id')
      .in('class_id', allClassIds);
    if (enrolments) {
      enrolmentMap = enrolments.reduce<Record<string, number>>((acc, e) => {
        acc[e.class_id] = (acc[e.class_id] ?? 0) + 1;
        return acc;
      }, {});
    }
  }

  const classes: ClassRow[] = allRawClasses.map((c) => ({
    ...c,
    enrolmentCount: enrolmentMap[c.id] ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          My Classes
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          {classes.length} {classes.length === 1 ? 'class' : 'classes'} assigned to you
        </p>
      </div>

      {/* Table card */}
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
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '8px' }}>
              No classes assigned yet
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
              Contact an admin to be assigned to a class.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '680px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                  {['Class Name', 'Course', 'Start Date', 'End Date', 'Enrolled', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--mist)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--ink)' }}>
                      <Link
                        href={`/teacher/classes/${cls.id}`}
                        style={{ color: 'var(--ink)', textDecoration: 'none' }}
                      >
                        {cls.class_name}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {cls.courses?.title ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {formatDate(cls.start_date)}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {formatDate(cls.end_date)}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {cls.enrolmentCount}/{cls.max_students ?? 20}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          ...statusBadge(cls.status),
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >
                        {statusLabel(cls.status)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        href={`/teacher/classes/${cls.id}`}
                        style={{
                          color: 'var(--jade)',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        View →
                      </Link>
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
