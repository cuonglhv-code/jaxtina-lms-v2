'use client'

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { createAdminCourse } from '../actions';
import { useLang } from '@/hooks/useLang';
import { LEVEL_OPTIONS, SKILL_OPTIONS } from '@/lib/i18n/translations';

export default function NewCoursePage() {
  const { lang, translations: tr } = useLang();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createAdminCourse(formData);
      } catch (err: unknown) {
        const e = err as { digest?: string };
        if (e?.digest?.startsWith('NEXT_REDIRECT')) return;
        setError(err instanceof Error ? err.message : tr.error);
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    color: 'var(--ink)',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--mist)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  };

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto' }}>
      <Link
        href="/admin/courses"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '24px' }}
      >
        ← {tr.courses}
      </Link>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          padding: '40px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '26px',
            color: 'var(--midnight)',
            marginBottom: '32px',
          }}
        >
          {tr.newCourse}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle} htmlFor="title">{tr.courseTitle} *</label>
            <input id="title" name="title" type="text" required style={inputStyle} placeholder={lang === 'vi' ? 'Ví dụ: IELTS Writing Task 2' : 'e.g. IELTS Writing Task 2'} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle} htmlFor="description">{tr.description}</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder={lang === 'vi' ? 'Mô tả khóa học...' : 'Describe this course...'}
            />
          </div>

          {/* Exam type */}
          <div>
            <label style={labelStyle} htmlFor="exam_type">Exam Type</label>
            <select id="exam_type" name="exam_type" style={inputStyle}>
              <option value="IELTS">IELTS</option>
              <option value="TOEIC">TOEIC</option>
              <option value="General English">{lang === 'vi' ? 'Tiếng Anh tổng quát' : 'General English'}</option>
              <option value="Business English">{lang === 'vi' ? 'Tiếng Anh thương mại' : 'Business English'}</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label style={labelStyle} htmlFor="level">{tr.level}</label>
            <select id="level" name="level" style={inputStyle}>
              <option value="">{tr.selectLevel}</option>
              {LEVEL_OPTIONS[lang].map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Target skill */}
          <div>
            <label style={labelStyle} htmlFor="target_skill">{tr.targetSkill}</label>
            <select id="target_skill" name="target_skill" style={inputStyle}>
              <option value="">{tr.selectSkill}</option>
              {SKILL_OPTIONS[lang].map((opt) => (
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
                color: '#ffffff',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                padding: '11px 28px',
                borderRadius: '8px',
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? tr.submitting : tr.newCourse}
            </button>
            <Link
              href="/admin/courses"
              style={{
                padding: '11px 20px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: 'var(--mist)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
