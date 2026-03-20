export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--card-shadow)',
  padding: '32px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'Instrument Serif, serif',
  fontSize: '20px',
  color: 'var(--midnight)',
  marginBottom: '20px',
  marginTop: 0,
};

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderRadius: '10px',
  backgroundColor: 'var(--chalk)',
  border: '1px solid var(--border)',
  textDecoration: 'none',
  color: 'var(--ink)',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
};

const criteriaData = [
  {
    code: 'TA',
    name: 'Task Achievement',
    description:
      'How fully and accurately the candidate addresses all parts of the task. For Task 2, this means responding to the prompt, presenting and illustrating ideas, supporting a position.',
    color: '#7c3aed',
    bg: 'rgba(139,92,246,0.08)',
  },
  {
    code: 'CC',
    name: 'Coherence & Cohesion',
    description:
      'How well the response is organized and flows. Looks at paragraphing, sequencing of ideas, linking words, referencing and substitution.',
    color: 'var(--ocean)',
    bg: 'rgba(27,79,114,0.08)',
  },
  {
    code: 'LR',
    name: 'Lexical Resource',
    description:
      'Range and accuracy of vocabulary. Considers word choice, collocation, spelling, and the ability to paraphrase and use less common words.',
    color: 'var(--jade)',
    bg: 'var(--jade-light)',
  },
  {
    code: 'GRA',
    name: 'Grammatical Range & Accuracy',
    description:
      'Range and accuracy of grammar. Looks at sentence structures, use of complex forms, punctuation, and error frequency and impact.',
    color: '#ca8a04',
    bg: 'rgba(234,179,8,0.08)',
  },
];

const quickRefs = [
  { label: 'Task 1 minimum word count', value: '150 words' },
  { label: 'Task 2 minimum word count', value: '250 words' },
  { label: 'Band score rounding', value: 'Rounded to nearest 0.5' },
  { label: 'Overall band calculation', value: 'Average of 4 criteria, rounded' },
  { label: 'Penalty for under word count', value: 'Affects TA score' },
  { label: 'Maximum band', value: '9.0' },
];

export default async function TeacherResourcesPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          Teaching Resources
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          Reference materials and marking guidelines for IELTS and TOEIC
        </p>
      </div>

      {/* IELTS Resources */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>IELTS Resources</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href="https://www.ielts.org/for-test-takers/score-explanation"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <span>IELTS Band Descriptors — Official Score Explanation</span>
            <span style={{ color: 'var(--mist)', fontSize: '12px' }}>ielts.org ↗</span>
          </a>
          <a
            href="https://www.cambridgeenglish.org/exams-and-tests/ielts/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <span>Cambridge IELTS — Exam Information & Practice Tests</span>
            <span style={{ color: 'var(--mist)', fontSize: '12px' }}>cambridgeenglish.org ↗</span>
          </a>
          <a
            href="https://www.britishcouncil.org/exam/ielts"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <span>British Council — IELTS Preparation & Resources</span>
            <span style={{ color: 'var(--mist)', fontSize: '12px' }}>britishcouncil.org ↗</span>
          </a>
          <a
            href="https://takeielts.britishcouncil.org/teach-ielts/ielts-band-descriptors"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <span>British Council — Writing Band Descriptors (Task 1 & 2)</span>
            <span style={{ color: 'var(--mist)', fontSize: '12px' }}>takeielts.britishcouncil.org ↗</span>
          </a>
        </div>
      </div>

      {/* Marking Guidelines */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>IELTS Writing Marking Criteria</h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginBottom: '24px', marginTop: 0 }}>
          Writing is assessed on four equally weighted criteria. Each contributes 25% to the final Writing band score.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {criteriaData.map((c) => (
            <div
              key={c.code}
              style={{
                borderRadius: '12px',
                border: '1px solid var(--border)',
                padding: '20px 22px',
                backgroundColor: c.bg,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fff',
                    backgroundColor: c.color,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {c.code}
                </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                  {c.name}
                </span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--mist)', margin: 0, lineHeight: '1.6' }}>
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick References */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Quick Reference</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {quickRefs.map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--chalk)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--mist)' }}>
                {label}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marking links */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Marking Tools</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="/teacher/submissions" style={linkStyle}>
            <span>Open Submissions Queue</span>
            <span style={{ color: 'var(--jade)', fontSize: '13px', fontWeight: 600 }}>Mark Now →</span>
          </a>
          <a href="/teacher/classes" style={linkStyle}>
            <span>My Classes</span>
            <span style={{ color: 'var(--mist)', fontSize: '12px' }}>View all →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
