'use client'

import { useState, useTransition } from 'react';
import { updateClass } from '../actions';
import type { Lang } from '@/lib/i18n/translations';

type ClassData = {
  id: string;
  class_name: string;
  course_id: string | null;
  teacher_id: string | null;
  start_date: string | null;
  end_date: string | null;
  max_students: number | null;
};

export default function EditClassForm({
  classData,
  courses,
  teachers,
  lang,
  tr,
}: {
  classData: ClassData;
  courses: { id: string; title: string }[];
  teachers: { id: string; full_name: string }[];
  lang: Lang;
  tr: { className: string; courses: string; teacher: string; startDate: string; endDate: string; maxStudents: string; selectCourse: string; selectTeacher: string; saveChanges: string; submitting: string; error: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateClass(formData);
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
    letterSpacing: '0.05em', marginBottom: '6px',
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
      <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--midnight)', marginBottom: '20px', marginTop: 0 }}>
        {lang === 'vi' ? 'Chỉnh sửa lớp học' : 'Edit Class'}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input type="hidden" name="id" value={classData.id} />

        <div>
          <label style={labelStyle}>{tr.className} *</label>
          <input name="class_name" type="text" required defaultValue={classData.class_name} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>{tr.courses}</label>
          <select name="course_id" defaultValue={classData.course_id ?? ''} style={inputStyle}>
            <option value="">{tr.selectCourse}</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>{tr.teacher}</label>
          <select name="teacher_id" defaultValue={classData.teacher_id ?? ''} style={inputStyle}>
            <option value="">{tr.selectTeacher}</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>{tr.startDate}</label>
            <input name="start_date" type="date" defaultValue={classData.start_date ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tr.endDate}</label>
            <input name="end_date" type="date" defaultValue={classData.end_date ?? ''} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>{tr.maxStudents}</label>
          <input name="max_students" type="number" min={1} max={100} defaultValue={classData.max_students ?? 20} style={{ ...inputStyle, maxWidth: '120px' }} />
        </div>

        {error && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444' }}>{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          style={{ backgroundColor: isPending ? 'var(--mist)' : 'var(--jade)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: isPending ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}
        >
          {isPending ? tr.submitting : tr.saveChanges}
        </button>
      </form>
    </div>
  );
}
