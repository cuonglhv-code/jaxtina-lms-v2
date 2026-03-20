import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Trophy, Star, CheckCircle2, BookOpen, Clock } from "lucide-react";
import Link from 'next/link';
import { Feedback } from "@/types/database";

export default async function SubmissionResultPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // Fetch submission context with visible scores and feedback
  const { data: submission, error } = await supabase
    .from('submissions')
    .select(`
      *,
      activities(*),
      scores(*),
      feedback(*)
    `)
    .eq('id', id)
    .eq('student_id', user.id) // Security: Essential ownership check
    .single();

  if (error || !submission) return notFound();

  // Filter for visible feedback only
  const visibleFeedback = (submission.feedback as unknown as Feedback[])?.filter((f) => f.is_visible) || [];
  const finalScore = submission.scores?.[0];
  const activity = submission.activities;

  return (
    <div className="min-h-screen bg-[var(--chalk)] p-6 md:p-12 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Navigation & Context */}
        <div className="space-y-4">
          <Link href="/learner/dashboard" className="flex items-center gap-2 text-[var(--mist)] hover:text-[var(--jade)] transition-colors text-sm font-bold uppercase tracking-widest italic group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
             <span className="bg-[var(--jade)] text-white text-[10px] font-black italic rounded-lg tracking-widest px-3 py-1 uppercase scale-110">Writing Result</span>
             <div className="h-4 w-[2px] bg-[var(--border)]" />
             <span className="font-sans text-[10px] font-black text-[var(--mist)] uppercase tracking-widest italic">{(activity.exam_target as string)?.replace('_', ' ')}</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black tracking-tighter leading-tight italic text-[var(--midnight)]">{activity.title}</h1>
        </div>

        {/* HERO: The Band Score Celebration */}
        <div className="bg-[var(--midnight)] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--jade)]/10 to-transparent p-6 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 bg-white/10 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
               <span className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-1 italic">Overall Band</span>
               <span className="font-display text-6xl font-black italic tracking-tighter text-[var(--jade)]">{finalScore?.score || '—'}</span>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Trophy className="text-[var(--jade)]" size={24} />
                <h2 className="font-display text-3xl font-black italic tracking-tighter">EXCELLENT WORK!</h2>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md italic">
                You have officially achieved an IELTS Band <strong className="text-white">{finalScore?.score}</strong>. 
                Your examiner has reviewed your writing and provided detailed feedback below.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-1">
          
          {/* THE FEEDBACK: Detailed Insights */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-[var(--jade)] pl-4 py-1">
              <h3 className="font-sans text-sm font-black italic tracking-widest text-[var(--mist)] uppercase leading-none underline underline-offset-8 decoration-[var(--jade)]/30">Expert Feedback</h3>
              <Star className="w-3 h-3 text-[var(--jade)]" />
            </div>
            <div className="bg-white rounded-[2.5rem] border border-[var(--border)] shadow-xl p-8 lg:p-12 space-y-8">
               {visibleFeedback.length > 0 ? (
                 visibleFeedback.map((f: Feedback) => (
                   <div key={f.id} className="prose prose-zinc max-w-none">
                     <p className="text-lg leading-relaxed font-semibold text-[var(--ink)] italic whitespace-pre-wrap">
                       {f.content}
                     </p>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-[var(--sand)] rounded-full flex items-center justify-center mx-auto">
                       <Clock className="w-8 h-8 text-[var(--mist)] animate-pulse" />
                    </div>
                    <p className="text-[var(--mist)] font-bold italic uppercase tracking-widest text-xs">Waiting for Teacher Review</p>
                 </div>
               )}
            </div>
          </section>

          {/* THE SUBMISSION: The Mirror */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-[var(--midnight)] pl-4 py-1">
              <h3 className="font-sans text-sm font-black italic tracking-widest text-[var(--mist)] uppercase leading-none underline underline-offset-8 decoration-[var(--midnight)]/30">Your Original Writing</h3>
              <CheckCircle2 className="w-3 h-3 text-[var(--midnight)]" />
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-[3rem] border border-[var(--border)] p-12 lg:p-20 relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--sand)] rounded-bl-full pointer-events-none opacity-50" />
               <p className="font-display text-2xl text-[var(--ink)] leading-[1.8] whitespace-pre-wrap italic opacity-80 decoration-[var(--jade)]/10 underline underline-offset-[12px]">
                 {submission.content}
               </p>
               <div className="mt-20 pt-12 border-t border-[var(--border)] flex items-center justify-start gap-12 text-[var(--mist)] text-[10px] font-black uppercase tracking-widest italic">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Words: {submission.content?.trim().split(/\s+/).length}
                  </div>
                  <div>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</div>
               </div>
            </div>
          </section>
        </div>

        {/* Action: Back to Progress */}
        <div className="flex justify-center pt-8">
           <Link href="/learner/dashboard" className="bg-[var(--midnight)] hover:bg-[var(--midnight)] text-white font-black italic rounded-2xl px-12 h-16 shadow-xl flex items-center justify-center uppercase tracking-tighter text-lg transition-transform hover:scale-105">
              CONTINUE MY JOURNEY
           </Link>
        </div>
      </div>
    </div>
  );
}
