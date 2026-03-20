export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n/translations';
import { updateClassStatus } from '../actions';
import EditClassForm from './EditClassForm';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusBadge(status: string | null) {
  if (status === 'completed') return { bg: 'var(--border)', color: 'var(--mist)' };
  if (status === 'cancelled') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  return { bg: 'var(--jade-light)', color: 'var(--jade)' };
}

export default async function ClassDetailPage({
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
  if (authError || !user) redirect('/login');

  const [
    { data: cls },
    { data: courses },
    { data: teachers },
    { data: enrolments },
  ] = await Promise.all([
    supabase
      .from('classes')
      .select('id, class_name, course_id, teacher_id, start_date, end_date, max_students, status, created_at, courses(title), teacher:teacher_id(full_name)')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('courses').select('id, title').order('title'),
    supabase.from('user_profiles').select('id, full_name').eq('role', 'teacher').order('full_name'),
    supabase.from('class_enrolments').select('id, student_id, enrolled_at, user_profiles:student_id(full_name, email)').eq('class_id', id),
  ]);

  if (!cls) notFound();

  type ClassData = typeof cls & { courses: { title: string } | null; teacher: { full_name: string } | null };
  const classData = cls as unknown as ClassData;
  const badge = statusBadge(classData.status);

  return (
    <div className="space-y-8">
      {/* Back nav */}
      <Link
        href="/admin/classes"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
      >
        ← {tr.classes}
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', margin: 0 }}>
              {classData.class_name}
            </h1>
            <span style={{ backgroundColor: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'DM Sans, sans-serif' }}>
              {classData.status === 'completed' ? tr.completed : classData.status === 'cancelled' ? tr.cancelled : tr.active}
            </span>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
            {classData.courses?.title ?? '—'} · {tr.teacher}: {classData.teacher?.full_name ?? '—'}
          </p>
        </div>

        {/* Status actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {classData.status !== 'completed' && (
            <form action={updateClassStatus}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value="completed" />
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--ink)', cursor: 'pointer', backgroundColor: '#fff' }}>
                {lang === 'vi' ? 'Đánh dấu hoàn thành' : 'Mark Completed'}
              </button>
            </form>
          )}
          {classData.status !== 'cancelled' && (
            <form action={updateClassStatus}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value="cancelled" />
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                {lang === 'vi' ? 'Hủy lớp' : 'Cancel Class'}
              </button>
            </form>
          )}
          {classData.status !== 'active' && (
            <form action={updateClassStatus}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="status" value="active" />
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', backgroundColor: 'var(--jade-light)', color: 'var(--jade)', cursor: 'pointer' }}>
                {lang === 'vi' ? 'Kích hoạt lại' : 'Reactivate'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Info cards */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { label: tr.startDate, value: formatDate(classData.start_date) },
            { label: tr.endDate, value: formatDate(classData.end_date) },
            { label: tr.maxStudents, value: String(classData.max_students ?? 20) },
            { label: tr.enrolled, value: String(enrolments?.length ?? 0) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Edit form */}
        <EditClassForm
          classData={{ id, class_name: classData.class_name, course_id: classData.course_id, teacher_id: classData.teacher_id, start_date: classData.start_date, end_date: classData.end_date, max_students: classData.max_students }}
          courses={(courses ?? []) as { id: string; title: string }[]}
          teachers={(teachers ?? []) as { id: string; full_name: string }[]}
          lang={lang}
          tr={tr}
        />
      </div>

      {/* Enrolled learners */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--chalk)' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--midnight)', margin: 0 }}>
            {lang === 'vi' ? 'Học viên đã đăng ký' : 'Enrolled Learners'} ({enrolments?.length ?? 0})
          </h2>
        </div>
        {!enrolments || enrolments.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', color: 'var(--mist)', fontSize: '14px' }}>
            {lang === 'vi' ? 'Chưa có học viên nào đăng ký.' : 'No learners enrolled yet.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                {[tr.name, tr.email, tr.joined].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enrolments.map((e) => {
                type EnrolmentRow = typeof e & { user_profiles: { full_name: string; email: string } | null };
                const row = e as unknown as EnrolmentRow;
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--ink)', fontWeight: 500 }}>{row.user_profiles?.full_name ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{row.user_profiles?.email ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                      {new Date(e.enrolled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
