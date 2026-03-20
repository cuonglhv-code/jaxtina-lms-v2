import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { MarkingForm } from "@/components/teacher/marking-form";
import { ChevronLeft, User, BookOpen, Clock, Info, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { Submission, Activity, Score, Feedback } from "@/types/database";

type SubmissionWithRelations = Submission & {
  activities: Activity;
  profiles: { full_name: string | null };
  scores: Score[];
  feedback: Feedback[];
};

export default async function MarkingPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // Fetch full submission context using our aligned join
  const { data: submissionData, error } = await supabase
    .from('submissions')
    .select(`
      *,
      activities(*),
      profiles:student_id(full_name),
      scores(*),
      feedback(*)
    `)
    .eq('id', id)
    .single();

  if (error || !submissionData) return notFound();

  const submission = submissionData as unknown as SubmissionWithRelations;
  const activity = submission.activities;
  const student = submission.profiles;

  return (
    <div className="min-h-screen bg-[var(--chalk)]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/teacher/dashboard" className="p-2 hover:bg-[var(--sand)] rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-[var(--mist)]" />
            </Link>
            <div className="h-8 w-[1px] bg-[var(--border)]" />
            <div>
              <h1 className="font-display text-xl font-black italic tracking-tighter uppercase leading-none text-[var(--midnight)]">Examiner Studio</h1>
              <span className="font-sans text-[10px] font-black tracking-widest text-[var(--jade)] uppercase italic">Professional IELTS Marking</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--sand)] rounded-2xl border border-[var(--border)]">
              <User className="w-4 h-4 text-[var(--mist)]" />
              <span className="font-sans text-sm font-bold text-[var(--ink)]">{student?.full_name || 'Learner'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--jade-light)] text-[var(--jade)] rounded-full text-[10px] font-black uppercase tracking-widest italic">
              <ShieldCheck size={12} />
              Secure Session
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-8 lg:p-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: Student Essay & Instructions */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Task Info Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-[2rem] border border-[var(--border)] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--ocean)]/10 text-[var(--ocean)] rounded-2xl flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-black text-[var(--mist)] uppercase tracking-widest italic">Task Title</p>
                  <p className="font-display text-sm font-bold leading-none mt-1 text-[var(--midnight)]">{activity.title}</p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-[2rem] border border-[var(--border)] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--jade)]/10 text-[var(--jade)] rounded-2xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-black text-[var(--mist)] uppercase tracking-widest italic">Target</p>
                  <p className="font-display text-sm font-bold uppercase leading-none mt-1 text-[var(--midnight)]">{(activity.exam_target as string)?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="p-6 bg-[var(--midnight)] text-white rounded-[2rem] border-none shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Info size={20} />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-black text-[var(--sand)] uppercase tracking-widest italic">Submission Phase</p>
                  <p className="font-display text-sm font-bold uppercase leading-none mt-1">{submission.status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Essay Mirror (Premium Focus) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[var(--midnight)] pl-4 py-1">
                <h3 className="font-sans text-sm font-black italic tracking-widest text-[var(--mist)] uppercase leading-none underline underline-offset-8 decoration-[var(--jade)]/30">Student Response</h3>
              </div>
              <div className="bg-white rounded-[3rem] border border-[var(--border)] shadow-xl p-12 lg:p-20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--jade)]/5 rounded-bl-full pointer-events-none group-hover:bg-[var(--jade)]/10 transition-colors" />
                <p className="font-display text-2xl text-[var(--ink)] leading-[1.8] whitespace-pre-wrap italic">
                  {submission.content}
                </p>
                
                <div className="mt-20 pt-12 border-t border-[var(--border)] flex items-center justify-between text-[var(--mist)] text-sm italic font-medium">
                  <div className="flex gap-6">
                    <span>Words: <strong className="text-[var(--jade)]">{submission.content?.trim().split(/\s+/).length}</strong></span>
                    <span>Target: <strong className="text-[var(--midnight)]">{activity.exam_target === 'task_1' ? '150+' : '250+'}</strong></span>
                  </div>
                  <span>Received {new Date(submission.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Task Instructions */}
            <div className="p-8 bg-[var(--sand)] rounded-[2rem] border border-[var(--border)]">
               <h4 className="font-sans text-[10px] font-black uppercase tracking-widest text-[var(--mist)] mb-4 italic">Task Instructions</h4>
               <p className="font-sans text-sm font-semibold text-[var(--ink)] leading-relaxed italic opacity-70">
                 {activity.instructions}
               </p>
            </div>
          </div>

          {/* RIGHT SIDE: Marking Console */}
          <div className="lg:col-span-4">
            <MarkingForm submission={submissionData as any} />
          </div>

        </div>
      </main>
    </div>
  );
}
