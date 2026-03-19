import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

export default async function LessonPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  // Fetch lesson details along with activities
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select(`
      *,
      modules ( id, title, course_id, courses ( title ) ),
      activities ( id, title, type, exam_target )
    `)
    .eq('id', id)
    .single();

  if (lessonError || !lesson) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Lesson Header Navigation */}
      <nav className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-10 box-border p-4 md:px-12 flex justify-between items-center shadow-sm">
        <Link href={`/courses/${lesson.modules.course_id}`} className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest italic group">
           <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
           Back to Course
        </Link>
        <div className="flex flex-col items-center">
           <p className="text-[10px] font-black uppercase text-zinc-400 opacity-60 tracking-widest leading-none mb-1 italic">{lesson.modules.courses.title}</p>
           <h1 className="text-sm font-bold tracking-tight uppercase italic">{lesson.modules.title}: {lesson.title}</h1>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" size="sm" className="font-bold border-zinc-200">Next Lesson <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 lg:divide-x border-x bg-white dark:bg-zinc-900 shadow-2xl">
         {/* Main Learning Area */}
         <div className="lg:col-span-3 p-8 lg:p-16 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-2">
                 <Badge className="bg-primary/10 text-primary border-none font-black italic rounded-lg tracking-widest">Lesson Contents</Badge>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic">{lesson.title}</h2>
              <div className="h-1 w-24 bg-primary rounded-full" />
            </header>

            {lesson.video_url && (
              <div className="aspect-video w-full rounded-3xl bg-zinc-900 overflow-hidden shadow-2xl relative group cursor-pointer">
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent p-12 flex flex-col justify-end">
                    <p className="text-white text-lg font-black italic uppercase tracking-tighter group-hover:translate-y-[-10px] transition-transform">Start Video Lesson</p>
                 </div>
                 <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white opacity-40 group-hover:scale-110 transition-transform" />
              </div>
            )}

            <article className="prose prose-zinc max-w-none dark:prose-invert">
              <div className="space-y-8 text-lg font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-4 border-zinc-100 pl-8">
                 {lesson.content || "This lesson contains vital strategies for your English proficiency exam. Review the materials below and complete the activities to progress."}
              </div>
            </article>

            {lesson.pdf_url && (
              <Card className="bg-zinc-50 border-none rounded-3xl overflow-hidden p-8 flex items-center justify-between group cursor-pointer hover:bg-zinc-100 transition-colors border-2 border-dashed border-zinc-200">
                 <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 group-hover:scale-105 transition-transform">
                       <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase tracking-tight text-lg leading-none">Lesson Handout</h4>
                      <p className="text-zinc-400 text-xs font-bold font-mono tracking-widest mt-1">PDF DOCUMENT [ 4.2 MB ]</p>
                    </div>
                 </div>
                 <Button className="h-12 w-12 rounded-full font-black shadow-xl shrink-0"><ChevronRight className="w-5 h-5" /></Button>
              </Card>
            )}
         </div>

         {/* Activities Sidebar */}
         <aside className="p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic underline underline-offset-4 decoration-primary/30">Lesson Activities</h3>
            
            <div className="space-y-4">
              {lesson.activities && lesson.activities.length > 0 ? (
                lesson.activities.map((activity: any) => (
                  <Card key={activity.id} className="bg-white dark:bg-zinc-900 border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-zinc-100 group">
                     <CardHeader className="p-4 flex flex-row items-center gap-4 bg-zinc-50/50 group-hover:bg-primary/5 transition-colors">
                        <div className="p-3 bg-zinc-100 rounded-xl group-hover:bg-primary transition-colors">
                           <CheckCircle2 className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950" />
                        </div>
                        <div className="space-y-1">
                           <CardTitle className="text-sm font-black italic uppercase italic tracking-tight">{activity.title}</CardTitle>
                           <Badge variant="outline" className="text-[9px] uppercase font-black text-zinc-400 tracking-tighter py-0">{activity.type}</Badge>
                        </div>
                     </CardHeader>
                     <CardContent className="p-4 pt-0">
                        <Button asChild className="w-full h-10 rounded-xl font-bold text-xs" variant="secondary">
                           <Link href={`/activities/${activity.id}`}>Complete Exercise</Link>
                        </Button>
                     </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 p-6 rounded-2xl border-2 border-dashed border-zinc-200">
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">No activities for this lesson.</p>
                </div>
              )}
            </div>
         </aside>
      </div>
    </div>
  );
}
