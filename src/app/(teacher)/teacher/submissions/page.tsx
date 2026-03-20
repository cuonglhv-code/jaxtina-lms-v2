export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function submissionStatusBadge(status: string): React.CSSProperties {
  if (status === 'graded') return { backgroundColor: 'var(--jade-light)', color: 'var(--jade)' };
  if (status === 'under_review') return { backgroundColor: 'rgba(234,179,8,0.1)', color: '#ca8a04' };
  if (status === 'submitted') return { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
  return { backgroundColor: 'var(--chalk)', color: 'var(--mist)' };
}

function typeBadgeStyle(type: string): React.CSSProperties {
  if (type === 'essay') return { backgroundColor: 'rgba(139,92,246,0.1)', color: '#7c3aed' };
  if (type === 'speaking') return { backgroundColor: 'rgba(234,179,8,0.1)', color: '#ca8a04' };
  if (type === 'quiz') return { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
  return { backgroundColor: 'var(--chalk)', color: 'var(--mist)' };
}

type SubmissionRow = {
  id: string;
  student_id: string;
  status: string;
  submitted_at: string | null;
  activities: { title: string; type: string } | null;
  user_profiles: { full_name: string } | null;
};

export default async function TeacherSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filterStatus = sp?.status ?? 'all';

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  // Get all class IDs for this teacher (both direct and class_teachers)
  const [{ data: directClasses }, { data: classTeacherRows }] = await Promise.all([
    supabase.from('classes').select('id').eq('teacher_id', user.id),
    supabase.from('class_teachers').select('class_id').eq('teacher_id', user.id),
  ]);

  const classIdSet = new Set<string>([
    ...((directClasses ?? []).map((c) => c.id)),
    ...((classTeacherRows ?? []).map((r) => r.class_id).filter(Boolean)),
  ]);
  const allClassIds = Array.from(classIdSet);

  let submissions: SubmissionRow[] = [];
  let submittedCount = 0;
  let underReviewCount = 0;
  let totalPendingCount = 0;

  if (allClassIds.length > 0) {
    // Get all enrolled student IDs across teacher's classes
    const { data: enrolments } = await supabase
      .from('class_enrolments')
      .select('student_id')
      .in('class_id', allClassIds);

    const studentIdSet = new Set<string>((enrolments ?? []).map((e) => e.student_id));
    const studentIds = Array.from(studentIdSet);

    if (studentIds.length > 0) {
      // Count stats
      const [{ count: sc }, { count: urc }] = await Promise.all([
        supabase.from('submissions').select('*', { count: 'exact', head: true }).in('student_id', studentIds).eq('status', 'submitted'),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).in('student_id', studentIds).eq('status', 'under_review'),
      ]);
      submittedCount = sc ?? 0;
      underReviewCount = urc ?? 0;
      totalPendingCount = submittedCount + underReviewCount;

      // Build query
      let query = supabase
        .from('submissions')
        .select('id, student_id, status, submitted_at, activities(title, type), user_profiles:student_id(full_name)')
        .in('student_id', studentIds)
        .order('submitted_at', { ascending: false });

      if (filterStatus === 'submitted') {
        query = query.eq('status', 'submitted');
      } else if (filterStatus === 'under_review') {
        query = query.eq('status', 'under_review');
      } else {
        // All pending (default view shows submitted + under_review)
        query = query.in('status', ['submitted', 'under_review']);
      }

      const { data: subs } = await query.limit(100);
      submissions = (subs ?? []) as unknown as SubmissionRow[];
    }
  }

  const filterTabs: { label: string; value: string; count: number }[] = [
    { label: 'Pending', value: 'all', count: totalPendingCount },
    { label: 'Submitted', value: 'submitted', count: submittedCount },
    { label: 'Under Review', value: 'under_review', count: underReviewCount },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          Submissions
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          Marking queue across all your classes
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {filterTabs.map((tab) => {
          const isActive = filterStatus === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value === 'all' ? '/teacher/submissions' : `/teacher/submissions?status=${tab.value}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                backgroundColor: isActive ? 'var(--midnight)' : '#fff',
                color: isActive ? '#fff' : 'var(--ink)',
                border: '1px solid',
                borderColor: isActive ? 'var(--midnight)' : 'var(--border)',
              }}
            >
              {tab.label}
              <span
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--chalk)',
                  color: isActive ? '#fff' : 'var(--mist)',
                  borderRadius: '10px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
        }}
      >
        {submissions.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--midnight)', marginBottom: '8px' }}>
              All caught up!
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
              No pending submissions. New submissions will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '680px' }}>
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
                {submissions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--ink)' }}>
                      {sub.user_profiles?.full_name ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {sub.activities?.title ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          ...typeBadgeStyle(sub.activities?.type ?? ''),
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {sub.activities?.type ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {formatDate(sub.submitted_at)}
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
                      <Link
                        href={`/teacher/marking/${sub.id}`}
                        style={{
                          display: 'inline-block',
                          backgroundColor: 'var(--jade)',
                          color: '#fff',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '6px 14px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                        }}
                      >
                        Mark Now
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
