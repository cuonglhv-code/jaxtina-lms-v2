'use client'

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { createClass } from '../actions';
import { useLang } from '@/hooks/useLang';

type CourseOption = { id: string; title: string };
type TeacherOption = { id: string; full_name: string };

export function CreateClassForm({
  courses,
  teachers,
}: {
  courses: CourseOption[];
  teachers: TeacherOption[];
}) {
  const { lang, translations: tr } = useLang();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createClass(formData);
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
        href="/admin/classes"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '24px' }}
      >
        ← {tr.classes}
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
          {tr.newClass}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Class name */}
          <div>
            <label style={labelStyle} htmlFor="class_name">{tr.className} *</label>
            <input
              id="class_name"
              name="class_name"
              type="text"
              required
              style={inputStyle}
              placeholder={lang === 'vi' ? 'Ví dụ: IELTS Thứ 2-4' : 'e.g. IELTS Mon-Wed'}
            />
          </div>

          {/* Course */}
          <div>
            <label style={labelStyle} htmlFor="course_id">{tr.courses}</label>
            <select id="course_id" name="course_id" style={inputStyle}>
              <option value="">{tr.selectCourse}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div>
            <label style={labelStyle} htmlFor="teacher_id">{tr.teacher}</label>
            <select id="teacher_id" name="teacher_id" style={inputStyle}>
              <option value="">{tr.selectTeacher}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle} htmlFor="start_date">{tr.startDate}</label>
              <input id="start_date" name="start_date" type="date" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="end_date">{tr.endDate}</label>
              <input id="end_date" name="end_date" type="date" style={inputStyle} />
            </div>
          </div>

          {/* Max students */}
          <div>
            <label style={labelStyle} htmlFor="max_students">{tr.maxStudents}</label>
            <input
              id="max_students"
              name="max_students"
              type="number"
              min={1}
              max={100}
              defaultValue={20}
              style={{ ...inputStyle, maxWidth: '160px' }}
            />
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
              {isPending ? tr.submitting : tr.newClass}
            </button>
            <Link
              href="/admin/classes"
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
