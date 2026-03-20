import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import Link from 'next/link';
import { SubmissionEditor } from "@/components/learner/SubmissionEditor";

export default async function ActivityPracticePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // 1. Fetch Activity Details
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (activityError || !activity) return notFound();

  // 2. Fetch Existing Submission (Draft or Graded)
  const { data: submission } = await supabase
    .from('submissions')
    .select('content, status')
    .eq('activity_id', id)
    .eq('student_id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <Link href="/learner/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-colors text-sm font-bold uppercase tracking-widest italic group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white text-[10px] font-black italic rounded-lg tracking-widest px-3 py-1 uppercase scale-110">Writing Practice</span>
            <div className="h-4 w-[2px] bg-zinc-200" />
            <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest italic">{(activity.exam_target as string)?.replace('_', ' ')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic">{activity.title}</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-1">
          {/* Instructions Panel */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-indigo-600 pl-4 py-1">
              <h3 className="text-sm font-black italic tracking-widest text-zinc-400 uppercase leading-none underline underline-offset-8 decoration-indigo-500/30">The Task</h3>
              <Info className="w-3 h-3 text-indigo-500" />
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl p-8 lg:p-12">
               <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed font-semibold text-zinc-700 dark:text-zinc-300 italic whitespace-pre-wrap">
                    {activity.instructions || "Please complete the writing task as requested."}
                  </p>
                  {activity.content && (
                    <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                       <p className="text-zinc-500 italic text-sm font-medium">{activity.content}</p>
                    </div>
                  )}
               </div>
            </div>
          </section>

          {/* Submission Editor */}
          <section className="space-y-6 pt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4 py-1">
                <h3 className="text-sm font-black italic tracking-widest text-zinc-400 uppercase leading-none underline underline-offset-8 decoration-emerald-500/30">Your Response</h3>
                <HelpCircle className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
            <SubmissionEditor 
              activityId={activity.id} 
              initialContent={submission?.content || ''}
              minWords={activity.exam_target === 'task_1' ? 150 : 250}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
