'use client'

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { updateAdminCourse } from '../../actions';
import type { Lang } from '@/lib/i18n/translations';

type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  target_skill: string | null;
  exam_type: string | null;
  is_published: boolean | null;
};

type Option = { value: string; label: string };

export default function EditCourseForm({
  course,
  lang,
  tr,
  levelOptions,
  skillOptions,
}: {
  course: Course;
  lang: Lang;
  tr: { courseTitle: string; description: string; level: string; targetSkill: string; selectLevel: string; selectSkill: string; courses: string; submitting: string; error: string; saveChanges: string };
  levelOptions: Option[];
  skillOptions: Option[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateAdminCourse(formData);
      } catch (err: unknown) {
        const e = err as { digest?: string };
        if (e?.digest?.startsWith('NEXT_REDIRECT')) return;
        setError(err instanceof Error ? err.message : tr.error);
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px', color: 'var(--ink)', backgroundColor: '#fff',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
    fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase',
    letterSpacing: '0.05em', marginBottom: '8px',
  };

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto' }}>
      <Link
        href="/admin/courses"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '24px' }}
      >
        ← {tr.courses}
      </Link>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: '40px' }}>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', color: 'var(--midnight)', marginBottom: '32px' }}>
          {lang === 'vi' ? 'Chỉnh sửa khóa học' : 'Edit Course'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="hidden" name="id" value={course.id} />

          <div>
            <label style={labelStyle} htmlFor="title">{tr.courseTitle} *</label>
            <input id="title" name="title" type="text" required defaultValue={course.title} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="description">{tr.description}</label>
            <textarea id="description" name="description" rows={4} defaultValue={course.description ?? ''} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="exam_type">Exam Type</label>
            <select id="exam_type" name="exam_type" defaultValue={course.exam_type ?? 'General English'} style={inputStyle}>
              <option value="IELTS">IELTS</option>
              <option value="TOEIC">TOEIC</option>
              <option value="General English">{lang === 'vi' ? 'Tiếng Anh tổng quát' : 'General English'}</option>
              <option value="Business English">{lang === 'vi' ? 'Tiếng Anh thương mại' : 'Business English'}</option>
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="level">{tr.level}</label>
            <select id="level" name="level" defaultValue={course.level ?? ''} style={inputStyle}>
              <option value="">{tr.selectLevel}</option>
              {levelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="target_skill">{tr.targetSkill}</label>
            <select id="target_skill" name="target_skill" defaultValue={course.target_skill ?? ''} style={inputStyle}>
              <option value="">{tr.selectSkill}</option>
              {skillOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#ef4444' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                backgroundColor: isPending ? 'var(--mist)' : 'var(--jade)',
                color: '#ffffff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                fontWeight: 500, padding: '11px 28px', borderRadius: '8px',
                border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? tr.submitting : tr.saveChanges}
            </button>
            <Link
              href="/admin/courses"
              style={{ padding: '11px 20px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
