import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle2, Send, Timer, AlertCircle } from "lucide-react";
import Link from 'next/link';

export default async function ActivityPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch activity with lesson/course info
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select(`
      *,
      lessons ( id, title, modules ( id, title, courses ( id, title ) ) )
    `)
    .eq('id', id)
    .maybeSingle();

  if (activityError || !activity) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col p-6 lg:p-12">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        {/* Activity Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6">
           <div className="space-y-4">
              <Link href={`/lessons/${activity.lessons.id}`} className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest italic group">
                 <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                 Back to Lesson
              </Link>
              <div className="flex items-center gap-2">
                 <Badge className="bg-primary text-zinc-950 border-none font-black italic rounded-lg tracking-widest">{activity.type}</Badge>
                 <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest italic">Target: {activity.exam_target}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic">{activity.title}</h1>
           </div>
           
           <div className="flex gap-4">
             {activity.time_limit && (
               <div className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-100 flex items-center gap-4 shadow-sm">
                  <Timer className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">Time remaining</p>
                    <p className="text-xl font-mono font-black">{activity.time_limit}:00</p>
                  </div>
               </div>
             )}
           </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-3">
           {/* Instructions */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white dark:bg-zinc-900 border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-zinc-50">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400 font-black uppercase text-xs italic">Instructions</div>
                   </div>
                   <h2 className="text-2xl font-black italic mt-4 uppercase">Prompt & Requirements</h2>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="text-zinc-600 dark:text-zinc-400 text-lg font-medium leading-relaxed italic border-l-4 border-zinc-100 pl-8">
                      {activity.instructions || "Please complete the exercise based on the lesson's material. Ensure your response is original and meets the word count requirements if specified."}
                   </div>
                   
                   {activity.type === 'essay' && (
                     <div className="space-y-4 pt-8">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Your Submission</label>
                        <Textarea 
                          placeholder="Type your answer here..." 
                          className="min-h-[400px] bg-zinc-50 border-none rounded-3xl p-8 text-lg font-medium shadow-inner focus-visible:ring-primary/20"
                        />
                        <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase italic">
                           <span>0 Words</span>
                           <span className="text-primary underline underline-offset-4 decoration-primary/30 tracking-widest">Saving Draft...</span>
                        </div>
                     </div>
                   )}
                </CardContent>
              </Card>
           </div>

           {/* Submit Sidebar */}
           <aside className="space-y-6">
              <Card className="bg-zinc-900 text-white rounded-3xl p-8 border-none shadow-2xl space-y-6 sticky top-28 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent p-6 pointer-events-none" />
                 <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 italic underline underline-offset-4 decoration-primary/30 relative">Status</h4>
                 
                 <div className="space-y-4 relative">
                   <div className="flex items-center gap-4 text-emerald-400 font-black text-xs uppercase italic">
                      <CheckCircle2 className="w-5 h-5" />
                      Saved to Cloud
                   </div>
                   <div className="flex items-center gap-4 text-zinc-500 font-black text-xs uppercase italic opacity-50">
                      <AlertCircle className="w-5 h-5 " />
                      Not Graded
                   </div>
                 </div>

                 <Button className="w-full bg-primary text-zinc-950 hover:bg-white hover:text-zinc-900 font-black rounded-xl h-14 shadow-xl shadow-primary/20 h-16 text-lg transition-all relative">
                    SUBMIT FINAL
                    <Send className="w-5 h-5 ml-2" />
                 </Button>
                 
                 <p className="text-[10px] text-center text-zinc-600 font-mono italic">
                    Once submitted, your teacher will be notified for marking.
                 </p>
              </Card>

              <div className="p-8 rounded-3xl border-2 border-dashed border-zinc-200 text-center">
                 <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic leading-tight">Pro Tip: Use academic language and connectives to boost your score.</p>
              </div>
           </aside>
        </section>
      </div>
    </div>
  );
}
