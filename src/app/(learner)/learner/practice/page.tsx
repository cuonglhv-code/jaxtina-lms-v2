export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PenLine } from 'lucide-react';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--card-shadow)',
  padding: '24px',
};

type Activity = {
  id: string;
  title: string;
  exam_target: string | null;
  instructions: string | null;
  type: string;
};

function truncate(text: string, maxLen: number): string {
  if (!text) return '';
  return text.length <= maxLen ? text : text.slice(0, maxLen).trimEnd() + '…';
}

function targetBadgeStyle(target: string | null): React.CSSProperties {
  const isTask1 = target === 'task_1' || target === 'Task 1';
  return {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    backgroundColor: isTask1 ? '#EFF6FF' : '#F5F3FF',
    color: isTask1 ? '#2563EB' : '#7C3AED',
  };
}

function formatTarget(target: string | null): string {
  if (!target) return 'General';
  if (target === 'task_1') return 'Task 1';
  if (target === 'task_2') return 'Task 2';
  return target;
}

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch all essay activities
  const { data: activities } = await supabase
    .from('activities')
    .select('id, title, exam_target, instructions, type')
    .eq('type', 'essay')
    .order('exam_target', { ascending: true })
    .order('title', { ascending: true });

  const task1 = (activities ?? []).filter((a: Activity) =>
    a.exam_target === 'task_1' || a.exam_target === 'Task 1'
  );
  const task2 = (activities ?? []).filter((a: Activity) =>
    a.exam_target === 'task_2' || a.exam_target === 'Task 2'
  );
  const other = (activities ?? []).filter((a: Activity) =>
    a.exam_target !== 'task_1' &&
    a.exam_target !== 'Task 1' &&
    a.exam_target !== 'task_2' &&
    a.exam_target !== 'Task 2'
  );

  const groups: { label: string; items: Activity[] }[] = [
    { label: 'IELTS Writing — Task 1', items: task1 },
    { label: 'IELTS Writing — Task 2', items: task2 },
    ...(other.length > 0 ? [{ label: 'Other Practice Tasks', items: other }] : []),
  ];

  const hasAny = (activities ?? []).length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          Practice
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          Sharpen your skills with IELTS Writing practice tasks
        </p>
      </div>

      {!hasAny ? (
        /* Empty state */
        <div style={{ ...cardStyle, textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--chalk)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <PenLine size={28} style={{ color: 'var(--mist)', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
            No practice tasks yet
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', maxWidth: '320px', margin: '0 auto' }}>
            Practice tasks will appear here once your teacher adds writing activities.
          </p>
        </div>
      ) : (
        groups.map((group) =>
          group.items.length === 0 ? null : (
            <section key={group.label}>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--midnight)', marginBottom: '16px' }}>
                {group.label}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {group.items.map((activity: Activity) => (
                  <div key={activity.id} style={cardStyle}>
                    {/* Badge */}
                    <div style={{ marginBottom: '12px' }}>
                      <span style={targetBadgeStyle(activity.exam_target)}>
                        {formatTarget(activity.exam_target)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '17px', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.3 }}>
                      {activity.title}
                    </h3>

                    {/* Instructions preview */}
                    {activity.instructions && (
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--mist)', lineHeight: 1.55, marginBottom: '20px' }}>
                        {truncate(activity.instructions, 120)}
                      </p>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/activities/${activity.id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', backgroundColor: 'var(--jade)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                    >
                      <PenLine size={14} />
                      Start Practice
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )
        )
      )}
    </div>
  );
}
