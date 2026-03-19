import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, User } from "lucide-react";
import Link from 'next/link';
import { MarkingForm } from "@/components/teacher/marking-form";
import { Profile } from "@/types/database";

export default async function MarkingDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();

  // Fetch submission with activity and student info
  const { data: submission, error } = await supabase
    .from('submissions')
    .select(`
      *,
      activities ( id, title, type, exam_target, instructions ),
      profiles:student_id ( id, full_name, role )
    `)
    .eq('id', id)
    .single();

  if (error || !submission) return notFound();

  const studentProfile = submission.profiles as unknown as Profile;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="space-y-4">
             <Link href="/teacher/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-colors text-sm font-bold uppercase tracking-widest italic group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Marking Queue
             </Link>
             <div className="flex items-center gap-3">
                <Badge className="bg-orange-500 text-white border-none font-black italic rounded-lg tracking-widest px-3 py-1 scale-110 uppercase">Pending Grading</Badge>
                <div className="h-4 w-[2px] bg-zinc-200" />
                <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest italic">{submission.activities.exam_target}</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic">{submission.activities.title}</h1>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
           {/* Student Submission Card */}
           <div className="lg:col-span-2 space-y-12">
              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight border-l-4 border-indigo-600 pl-4 uppercase italic leading-none">Student Work</h3>
                    <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase text-[10px] italic">
                       <User className="w-3 h-3" /> {studentProfile?.full_name || "Unknown Student"}
                    </div>
                 </div>

                 <Card className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl p-12">
                    <div className="prose prose-zinc max-w-none dark:prose-invert">
                       <div className="text-xl leading-relaxed font-medium text-zinc-700 dark:text-zinc-300 italic whitespace-pre-wrap">
                          {submission.content || "[ NO SUBMISSION CONTENT FOUND ]"}
                       </div>
                    </div>
                 </Card>
              </section>

              <section className="space-y-6">
                 <div className="flex items-center gap-4 border-t pt-12">
                    <h3 className="text-sm font-black italic tracking-widest text-zinc-400 uppercase leading-none underline underline-offset-8 decoration-primary/30">Original Question</h3>
                 </div>
                 <p className="text-sm font-medium text-zinc-500 italic italic max-w-2xl">{submission.activities.instructions}</p>
              </section>
           </div>

          {/* Marking Sidebar */}
          <MarkingForm submission={submission} />
        </div>
      </div>
    </div>
  );
}
