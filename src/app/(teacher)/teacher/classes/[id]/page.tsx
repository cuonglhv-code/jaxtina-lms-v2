export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';

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

function submissionStatusBadge(status: string | null): React.CSSProperties {
  if (status === 'graded') return { backgroundColor: 'var(--jade-light)', color: 'var(--jade)' };
  if (status === 'under_review') return { backgroundColor: 'rgba(234,179,8,0.1)', color: '#ca8a04' };
  if (status === 'submitted') return { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
  return { backgroundColor: 'var(--chalk)', color: 'var(--mist)' };
}

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  // Fetch the class — verify it belongs to this teacher (direct or via class_teachers)
  const { data: cls } = await supabase
    .from('classes')
    .select('id, class_name, course_id, teacher_id, start_date, end_date, max_students, status, courses(title)')
    .eq('id', id)
    .maybeSingle();

  if (!cls) notFound();

  // Check access: direct teacher_id OR in class_teachers
  const isDirectTeacher = cls.teacher_id === user.id;
  let hasAccess = isDirectTeacher;
  if (!isDirectTeacher) {
    const { data: ctRow } = await supabase
      .from('class_teachers')
      .select('id')
      .eq('class_id', id)
      .eq('teacher_id', user.id)
      .maybeSingle();
    hasAccess = !!ctRow;
  }
  if (!hasAccess) redirect('/teacher/classes');

  type ClassData = {
    id: string;
    class_name: string;
    course_id: string | null;
    teacher_id: string | null;
    start_date: string | null;
    end_date: string | null;
    max_students: number | null;
    status: string | null;
    courses: { title: string } | null;
  };
  const classData = cls as unknown as ClassData;
  const badge = statusBadge(classData.status);

  // Fetch enrolled students
  const { data: enrolments } = await supabase
    .from('class_enrolments')
    .select('id, student_id, enrolled_at, user_profiles:student_id(full_name, email, avatar_url)')
    .eq('class_id', id)
    .order('enrolled_at', { ascending: false });

  type EnrolmentRow = {
    id: string;
    student_id: string;
    enrolled_at: string;
    user_profiles: { full_name: string; email: string; avatar_url: string | null } | null;
  };
  const enrolledStudents = (enrolments ?? []) as unknown as EnrolmentRow[];
  const studentIds = enrolledStudents.map((e) => e.student_id);

  // Fetch recent submissions from students in this class
  type SubmissionRow = {
    id: string;
    student_id: string;
    status: string;
    submitted_at: string | null;
    activities: { title: string; type: string } | null;
    user_profiles: { full_name: string } | null;
  };
  let recentSubmissions: SubmissionRow[] = [];
  if (studentIds.length > 0) {
    const { data: subs } = await supabase
      .from('submissions')
      .select('id, student_id, status, submitted_at, activities(title, type), user_profiles:student_id(full_name)')
      .in('student_id', studentIds)
      .order('submitted_at', { ascending: false })
      .limit(10);
    recentSubmissions = (subs ?? []) as unknown as SubmissionRow[];
  }

  // Fetch latest submission status per student for the enrolled table
  const latestSubMap: Record<string, string> = {};
  if (studentIds.length > 0) {
    const { data: allSubs } = await supabase
      .from('submissions')
      .select('student_id, status, submitted_at')
      .in('student_id', studentIds)
      .order('submitted_at', { ascending: false });
    if (allSubs) {
      for (const sub of allSubs) {
        if (!latestSubMap[sub.student_id]) {
          latestSubMap[sub.student_id] = sub.status;
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/teacher/classes"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
      >
        ← My Classes
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', margin: 0 }}>
          {classData.class_name}
        </h1>
        <span
          style={{
            ...badge,
            padding: '3px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {statusLabel(classData.status)}
        </span>
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginTop: '-20px' }}>
        {classData.courses?.title ?? '—'} · {formatDate(classData.start_date)} – {formatDate(classData.end_date)}
      </p>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Enrolled', value: enrolledStudents.length },
          { label: 'Capacity', value: classData.max_students ?? 20 },
          { label: 'Recent Submissions', value: recentSubmissions.length },
          { label: 'Pending Review', value: recentSubmissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--card-shadow)',
              padding: '20px 24px',
            }}
          >
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              {label}
            </p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Enrolled students */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--chalk)' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--midnight)', margin: 0 }}>
            Enrolled Students ({enrolledStudents.length})
          </h2>
        </div>

        {enrolledStudents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
            No students enrolled yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '560px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Email', 'Enrolled', 'Last Submission'].map((h) => (
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
                {enrolledStudents.map((enr) => {
                  const lastStatus = latestSubMap[enr.student_id];
                  return (
                    <tr key={enr.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar name={enr.user_profiles?.full_name ?? ''} size="sm" imageUrl={enr.user_profiles?.avatar_url} />
                          <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{enr.user_profiles?.full_name ?? '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{enr.user_profiles?.email ?? '—'}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{formatDate(enr.enrolled_at)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {lastStatus ? (
                          <span
                            style={{
                              ...submissionStatusBadge(lastStatus),
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {lastStatus.replace('_', ' ')}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--mist)', fontSize: '13px' }}>None yet</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent submissions */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--chalk)' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--midnight)', margin: 0 }}>
            Recent Submissions
          </h2>
        </div>

        {recentSubmissions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
            No submissions yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Activity', 'Type', 'Submitted', 'Status', 'Action'].map((h) => (
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
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--ink)' }}>
                      {sub.user_profiles?.full_name ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {sub.activities?.title ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ backgroundColor: 'var(--chalk)', color: 'var(--mist)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {sub.activities?.type ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {sub.submitted_at ? formatDate(sub.submitted_at) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          ...submissionStatusBadge(sub.status),
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {(sub.status === 'submitted' || sub.status === 'under_review') ? (
                        <Link
                          href={`/teacher/marking/${sub.id}`}
                          style={{ color: 'var(--jade)', fontWeight: 500, textDecoration: 'none', fontSize: '13px' }}
                        >
                          Mark →
                        </Link>
                      ) : (
                        <Link
                          href={`/teacher/marking/${sub.id}`}
                          style={{ color: 'var(--mist)', fontWeight: 500, textDecoration: 'none', fontSize: '13px' }}
                        >
                          View →
                        </Link>
                      )}
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
