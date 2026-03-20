export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n/translations';
import type { Score, Feedback, Submission, Activity } from '@/types/database';

type SubmissionRow = Submission & { activities: Activity | null };

interface IELTSEvaluation {
  overallBand?: number;
  score?: number;
  TA?: number;
  CC?: number;
  LR?: number;
  GRA?: number;
  keyImprovements?: string[];
  areas_for_improvement?: string[];
  overall_feedback?: string;
}

function tryParse(content: string | null): IELTSEvaluation | null {
  if (!content) return null;
  try {
    const raw: unknown = JSON.parse(content);
    if (typeof raw === 'object' && raw !== null) return raw as IELTSEvaluation;
    return null;
  } catch {
    return null;
  }
}

function progressBar(score: number, color: string) {
  const pct = Math.max(Math.min((score / 9) * 100, 100), 0).toFixed(1);
  return (
    <div style={{ height: '3px', backgroundColor: 'var(--border)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '2px' }} />
    </div>
  );
}

const CRITERIA = [
  { key: 'TA' as const, label: 'Task Achievement', shortLabel: 'TA', borderColor: 'var(--jade)' },
  { key: 'CC' as const, label: 'Coherence & Cohesion', shortLabel: 'CC', borderColor: 'var(--ocean)' },
  { key: 'LR' as const, label: 'Lexical Resource', shortLabel: 'LR', borderColor: 'rgba(14,159,110,0.5)' },
  { key: 'GRA' as const, label: 'Grammatical Range', shortLabel: 'GRA', borderColor: 'rgba(27,79,114,0.5)' },
];

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const lang = ((sp?.lang ?? 'vi') === 'en' ? 'en' : 'vi') as Lang;
  const tr = t[lang];

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }

  // Fetch submission (verify ownership), score, and visible feedback in parallel
  const [
    { data: submissionData, error: subError },
    { data: scoreData },
    { data: feedbackData },
  ] = await Promise.all([
    supabase
      .from('submissions')
      .select('*, activities(*)')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('scores')
      .select('*')
      .eq('submission_id', id)
      .maybeSingle(),
    supabase
      .from('feedback')
      .select('*')
      .eq('submission_id', id)
      .eq('is_visible', true)
      .maybeSingle(),
  ]);

  if (subError || !submissionData) notFound();

  const submission = submissionData as unknown as SubmissionRow;

  // Security: verify this submission belongs to the current user
  if (!user || submission.student_id !== user.id) notFound();

  const score = scoreData as Score | null;
  const feedback = feedbackData as Feedback | null;

  // ── Not-available state ──────────────────────────────────────────────────
  if (!feedback || !score) {
    return (
      <div style={{ padding: '40px 0' }}>
        <Link
          href="/learner/dashboard"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '32px' }}
        >
          ← {tr.backToDashboard}
        </Link>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)',
            padding: '64px 48px',
            textAlign: 'center',
            maxWidth: '440px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: 'var(--chalk)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px',
            }}
          >
            ⏳
          </div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '24px',
              color: 'var(--midnight)',
              marginBottom: '12px',
            }}
          >
            {tr.resultsNotAvailable}
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginBottom: '28px' }}>
            {tr.teacherReviewing}
          </p>
          <Link
            href="/learner/dashboard"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'var(--midnight)', color: '#ffffff',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500,
              padding: '10px 24px', borderRadius: '8px', textDecoration: 'none',
            }}
          >
            ← {tr.backToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  // ── Parse feedback content ───────────────────────────────────────────────
  const parsed = tryParse(feedback.content);
  const overallBand = score.score;
  const improvements: string[] =
    parsed?.keyImprovements ?? parsed?.areas_for_improvement ?? [];
  const hasStructuredCriteria =
    parsed !== null && (parsed.TA !== undefined || parsed.CC !== undefined);

  return (
    <>
      {/* CSS animation */}
      <style>{`
        @keyframes bandReveal {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .band-reveal { animation: bandReveal 600ms ease-out both; }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto' }} className="space-y-8">
        {/* Back nav */}
        <Link
          href="/learner/dashboard"
          style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)',
            display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
          }}
        >
          ← {tr.backToDashboard}
        </Link>

        {/* Band Reveal card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)',
            padding: '40px',
          }}
        >
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--mist)', marginBottom: '8px' }}>
            {submission.activities?.title ?? 'Essay'} ·{' '}
            {new Date(submission.submitted_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>

          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--mist)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px',
            }}
          >
            {tr.overallBand}
          </p>

          <div
            className="band-reveal"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '80px',
              lineHeight: 1,
              color: 'var(--midnight)',
            }}
          >
            {overallBand}
          </div>

          {progressBar(overallBand, 'var(--jade)')}
        </div>

        {/* Criteria Scorecard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          {CRITERIA.map((c) => {
            const bandValue: number = hasStructuredCriteria
              ? (parsed?.[c.key] ?? overallBand)
              : overallBand;
            return (
              <div
                key={c.key}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${c.borderColor}`,
                  boxShadow: 'var(--card-shadow)',
                  padding: '24px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--mist)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                  }}
                >
                  {c.shortLabel} · {c.label}
                </p>
                <p
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '32px',
                    color: 'var(--midnight)',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {bandValue}
                </p>
                {progressBar(bandValue, c.borderColor)}
                {!hasStructuredCriteria && (
                  <p
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '11px',
                      color: 'var(--mist)',
                      marginTop: '8px',
                    }}
                  >
                    {tr.bandConfirmed}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Key Improvements */}
        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '22px',
              color: 'var(--midnight)',
              marginBottom: '16px',
            }}
          >
            {tr.whatToFocusOn}
          </h2>

          {improvements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {improvements.map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--jade)',
                    boxShadow: 'var(--card-shadow)',
                    padding: '16px 20px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Instrument Serif, serif',
                      fontSize: '18px',
                      color: 'var(--jade)',
                      lineHeight: 1.4,
                      flexShrink: 0,
                      minWidth: '20px',
                    }}
                  >
                    {i + 1}.
                  </span>
                  <p
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '15px',
                      color: 'var(--ink)',
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--jade)',
                boxShadow: 'var(--card-shadow)',
                padding: '20px',
              }}
            >
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'var(--mist)',
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                {lang === 'vi' ? 'Nhận xét của giáo viên' : 'Teacher feedback'}
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '15px',
                  color: 'var(--ink)',
                  margin: 0,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {parsed?.overall_feedback ?? feedback.content}
              </p>
            </div>
          )}
        </div>

        {/* Bottom back link */}
        <div style={{ paddingBottom: '40px' }}>
          <Link
            href="/learner/dashboard"
            style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)',
              display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
            }}
          >
            ← {tr.backToDashboard}
          </Link>
        </div>
      </div>
    </>
  );
}
