export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--card-shadow)',
  padding: '24px',
};

function scoreBadge(score: number, maxScore: number) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const color = pct >= 75 ? 'var(--jade)' : pct >= 50 ? '#F59E0B' : '#EF4444';
  const bg = pct >= 75 ? 'var(--jade-light)' : pct >= 50 ? '#FFF7ED' : '#FEF2F2';
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '8px 16px', borderRadius: '12px', backgroundColor: bg }}>
      <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color, lineHeight: 1 }}>
        {score}
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--mist)' }}>
          /{maxScore}
        </span>
      </span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
        Score
      </span>
    </div>
  );
}

export default async function FeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch graded submissions with activity info
  const { data: gradedSubs } = await supabase
    .from('submissions')
    .select('id, activity_id, submitted_at, activities(id, title, type, exam_target)')
    .eq('student_id', user.id)
    .eq('status', 'graded')
    .order('submitted_at', { ascending: false });

  const subs = (gradedSubs ?? []) as any[];

  // For each submission, fetch visible feedback and scores
  type FeedbackItem = {
    subId: string;
    activityTitle: string;
    activityType: string;
    examTarget: string | null;
    submittedAt: string;
    feedbackContent: string[];
    score: number | null;
    maxScore: number | null;
  };

  const feedbackItems: FeedbackItem[] = [];

  for (const sub of subs) {
    const [{ data: feedbacks }, { data: scores }] = await Promise.all([
      supabase
        .from('feedback')
        .select('id, content, is_visible, created_at')
        .eq('submission_id', sub.id)
        .eq('is_visible', true)
        .order('created_at', { ascending: true }),
      supabase
        .from('scores')
        .select('id, score, max_score')
        .eq('submission_id', sub.id)
        .limit(1),
    ]);

    feedbackItems.push({
      subId: sub.id,
      activityTitle: sub.activities?.title ?? 'Untitled Activity',
      activityType: sub.activities?.type ?? 'essay',
      examTarget: sub.activities?.exam_target ?? null,
      submittedAt: sub.submitted_at,
      feedbackContent: (feedbacks ?? []).map((f: any) => f.content).filter(Boolean),
      score: scores?.[0]?.score ?? null,
      maxScore: scores?.[0]?.max_score ?? null,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          My Feedback
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          Teacher feedback on your graded submissions
        </p>
      </div>

      {feedbackItems.length === 0 ? (
        /* Empty state */
        <div style={{ ...cardStyle, textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--chalk)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <MessageSquare size={28} style={{ color: 'var(--mist)', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
            No feedback yet
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', maxWidth: '360px', margin: '0 auto' }}>
            Complete your first essay and submit it — your teacher&apos;s feedback will appear here once graded.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {feedbackItems.map((item) => (
            <div key={item.subId} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {/* Title + meta */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      fontFamily: 'DM Sans, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      backgroundColor: '#F5F3FF',
                      color: '#7C3AED',
                    }}>
                      {item.activityType}
                    </span>
                    {item.examTarget && (
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 500,
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: 'var(--chalk)',
                        color: 'var(--mist)',
                        border: '1px solid var(--border)',
                      }}>
                        {item.examTarget === 'task_1' ? 'Task 1' : item.examTarget === 'task_2' ? 'Task 2' : item.examTarget}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '19px', color: 'var(--ink)', marginBottom: '4px', lineHeight: 1.3 }}>
                    {item.activityTitle}
                  </h3>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--mist)' }}>
                    Submitted {new Date(item.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Score badge */}
                {item.score !== null && item.maxScore !== null && (
                  scoreBadge(item.score, item.maxScore)
                )}
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border)', marginBottom: '16px' }} />

              {/* Feedback content */}
              {item.feedbackContent.length === 0 ? (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', fontStyle: 'italic' }}>
                  Your teacher has not left written feedback for this submission yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {item.feedbackContent.map((content, idx) => (
                    <div key={idx} style={{ backgroundColor: 'var(--chalk)', borderRadius: '10px', padding: '16px', borderLeft: '3px solid var(--jade)' }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
