export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatCard } from '@/components/layout/StatCard';
import { FileText, CheckCircle, TrendingUp, Award } from 'lucide-react';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--card-shadow)',
  padding: '24px',
};

type StatusKey = 'draft' | 'submitted' | 'under_review' | 'graded';

const statusConfig: Record<StatusKey, { label: string; bg: string; color: string }> = {
  draft: { label: 'Draft', bg: 'var(--chalk)', color: 'var(--mist)' },
  submitted: { label: 'Submitted', bg: '#FFF7ED', color: '#EA580C' },
  under_review: { label: 'Under Review', bg: '#EFF6FF', color: '#2563EB' },
  graded: { label: 'Graded', bg: 'var(--jade-light)', color: 'var(--jade)' },
};

function statusBadge(status: string) {
  const cfg = statusConfig[status as StatusKey] ?? { label: status, bg: 'var(--chalk)', color: 'var(--mist)' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 600,
      fontFamily: 'DM Sans, sans-serif',
      letterSpacing: '0.04em',
      backgroundColor: cfg.bg,
      color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
}

function typeBadge(type: string) {
  const colors: Record<string, { bg: string; color: string }> = {
    essay: { bg: '#F5F3FF', color: '#7C3AED' },
    quiz: { bg: '#F0FDF4', color: '#16A34A' },
    speaking: { bg: '#FFF7ED', color: '#EA580C' },
  };
  const c = colors[type] ?? { bg: 'var(--chalk)', color: 'var(--mist)' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      fontFamily: 'DM Sans, sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      backgroundColor: c.bg,
      color: c.color,
    }}>
      {type}
    </span>
  );
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch all submissions with related activity and score data
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id, activity_id, status, submitted_at, activities(id, title, type), scores(id, score, max_score, marked_at)')
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false });

  const subs = (submissions ?? []) as any[];

  const totalSubmitted = subs.filter((s) => s.status !== 'draft').length;
  const totalGraded = subs.filter((s) => s.status === 'graded').length;

  const gradedWithScore = subs.filter((s) => s.status === 'graded' && s.scores && s.scores.length > 0);
  const avgScore = gradedWithScore.length > 0
    ? Math.round(
        gradedWithScore.reduce((acc: number, s: any) => {
          const score = s.scores[0];
          return acc + (score.max_score > 0 ? (score.score / score.max_score) * 100 : 0);
        }, 0) / gradedWithScore.length
      )
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          My Progress
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          Track your submissions and performance over time
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        <StatCard icon={FileText}    iconBg="#8B5CF6"       value={subs.length}       label="Total Submissions" />
        <StatCard icon={TrendingUp}  iconBg="#F59E0B"       value={totalSubmitted}    label="Submitted" />
        <StatCard icon={CheckCircle} iconBg="var(--jade)"   value={totalGraded}       label="Graded" />
        <StatCard icon={Award}       iconBg="var(--ocean)"  value={avgScore !== null ? `${avgScore}%` : '—'} label="Avg. Score" />
      </div>

      {/* Submissions history */}
      <section>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--midnight)', marginBottom: '16px' }}>
          Submission History
        </h2>

        {subs.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--chalk)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <TrendingUp size={28} style={{ color: 'var(--mist)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
              No submissions yet
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', maxWidth: '320px', margin: '0 auto' }}>
              Complete your first activity and submit it — your progress will appear here!
            </p>
          </div>
        ) : (
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                  {['Activity', 'Type', 'Submitted', 'Status', 'Score', ''].map((h) => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 500, color: 'var(--mist)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((sub: any, idx: number) => {
                  const activity = sub.activities;
                  const score = sub.scores?.[0];
                  const href = sub.status === 'graded'
                    ? `/learner/results/${sub.id}`
                    : `/learner/submissions/${sub.id}`;

                  return (
                    <tr
                      key={sub.id}
                      style={{ borderBottom: idx < subs.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background-color 0.15s' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>
                          {activity?.title ?? 'Untitled Activity'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {activity?.type ? typeBadge(activity.type) : '—'}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--mist)', whiteSpace: 'nowrap' }}>
                        {sub.submitted_at
                          ? new Date(sub.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {statusBadge(sub.status)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {score ? (
                          <span style={{ fontWeight: 700, color: 'var(--jade)', fontFamily: 'Instrument Serif, serif', fontSize: '16px' }}>
                            {score.score}
                            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--mist)' }}>
                              /{score.max_score}
                            </span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--mist)', fontSize: '12px' }}>Awaiting</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <Link
                          href={href}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--jade)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                        >
                          View
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
