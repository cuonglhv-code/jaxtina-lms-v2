export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';

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

type LearnerRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  className: string;
  classId: string;
  latestSubmissionStatus: string | null;
  latestSubmissionDate: string | null;
  latestScore: number | null;
};

export default async function TeacherLearnersPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  // Get all class IDs for this teacher
  const [{ data: directClasses }, { data: classTeacherRows }] = await Promise.all([
    supabase.from('classes').select('id, class_name').eq('teacher_id', user.id),
    supabase.from('class_teachers').select('class_id').eq('teacher_id', user.id),
  ]);

  type ClassMeta = { id: string; class_name: string };
  const directClassMap = new Map<string, string>((directClasses ?? []).map((c) => [c.id, c.class_name]));

  const linkedClassIds = (classTeacherRows ?? []).map((r) => r.class_id).filter(Boolean) as string[];
  const missingIds = linkedClassIds.filter((id) => !directClassMap.has(id));

  if (missingIds.length > 0) {
    const { data: linkedClassData } = await supabase
      .from('classes')
      .select('id, class_name')
      .in('id', missingIds);
    ((linkedClassData ?? []) as ClassMeta[]).forEach((c) => directClassMap.set(c.id, c.class_name));
  }

  const allClassIds = Array.from(directClassMap.keys());

  if (allClassIds.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
            My Learners
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
            All learners across your classes
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)',
            padding: '64px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '8px' }}>
            No learners yet
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
            Students will appear here once enrolled in your classes.
          </p>
        </div>
      </div>
    );
  }

  // Get enrolments with student info
  const { data: enrolments } = await supabase
    .from('class_enrolments')
    .select('student_id, class_id, enrolled_at, user_profiles:student_id(id, full_name, email, avatar_url)')
    .in('class_id', allClassIds);

  type EnrolmentRow = {
    student_id: string;
    class_id: string;
    enrolled_at: string;
    user_profiles: { id: string; full_name: string | null; email: string | null; avatar_url: string | null } | null;
  };
  const rawEnrolments = (enrolments ?? []) as unknown as EnrolmentRow[];

  // Build unique students (one entry per student per class)
  const studentIds = [...new Set(rawEnrolments.map((e) => e.student_id))];

  // Fetch latest submission per student
  let latestSubMap: Record<string, { status: string; submitted_at: string | null }> = {};
  let latestScoreMap: Record<string, number | null> = {};

  if (studentIds.length > 0) {
    const { data: allSubs } = await supabase
      .from('submissions')
      .select('student_id, status, submitted_at')
      .in('student_id', studentIds)
      .order('submitted_at', { ascending: false });

    if (allSubs) {
      for (const sub of allSubs) {
        if (!latestSubMap[sub.student_id]) {
          latestSubMap[sub.student_id] = { status: sub.status, submitted_at: sub.submitted_at };
        }
      }
    }

    // Fetch latest score per student
    const { data: allScores } = await supabase
      .from('scores')
      .select('submission_id, score, submissions!inner(student_id)')
      .in('submissions.student_id', studentIds)
      .order('marked_at', { ascending: false });

    type ScoreWithSub = { submission_id: string; score: number; submissions: { student_id: string } };
    if (allScores) {
      for (const row of allScores as unknown as ScoreWithSub[]) {
        const sid = row.submissions?.student_id;
        if (sid && latestScoreMap[sid] === undefined) {
          latestScoreMap[sid] = row.score;
        }
      }
    }
  }

  // Deduplicate to one row per student (use first enrolment found)
  const seenStudents = new Set<string>();
  const learners: LearnerRow[] = [];
  for (const enr of rawEnrolments) {
    if (!seenStudents.has(enr.student_id)) {
      seenStudents.add(enr.student_id);
      const latestSub = latestSubMap[enr.student_id];
      learners.push({
        id: enr.student_id,
        full_name: enr.user_profiles?.full_name ?? null,
        email: enr.user_profiles?.email ?? null,
        avatar_url: enr.user_profiles?.avatar_url ?? null,
        className: directClassMap.get(enr.class_id) ?? '—',
        classId: enr.class_id,
        latestSubmissionStatus: latestSub?.status ?? null,
        latestSubmissionDate: latestSub?.submitted_at ?? null,
        latestScore: latestScoreMap[enr.student_id] ?? null,
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          My Learners
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          {learners.length} {learners.length === 1 ? 'learner' : 'learners'} across all your classes
        </p>
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
        {learners.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '8px' }}>
              No learners yet
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
              Students will appear here once enrolled in your classes.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', minWidth: '720px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Email', 'Class', 'Last Submission', 'Latest Score'].map((h) => (
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
                {learners.map((learner) => (
                  <tr key={learner.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={learner.full_name ?? ''} size="sm" imageUrl={learner.avatar_url} />
                        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{learner.full_name ?? '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{learner.email ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{learner.className}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {learner.latestSubmissionStatus ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              ...submissionStatusBadge(learner.latestSubmissionStatus),
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {learner.latestSubmissionStatus.replace('_', ' ')}
                          </span>
                          {learner.latestSubmissionDate && (
                            <span style={{ fontSize: '12px', color: 'var(--mist)' }}>
                              {formatDate(learner.latestSubmissionDate)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--mist)', fontSize: '13px' }}>None yet</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {learner.latestScore !== null ? (
                        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--midnight)' }}>
                          {learner.latestScore}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--mist)', fontSize: '13px' }}>—</span>
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
