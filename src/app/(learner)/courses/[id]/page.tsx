import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, GraduationCap, ChevronLeft, Play, FileText, CheckCircle2, Lock } from "lucide-react";
import Link from 'next/link';

export default async function CourseDetailPage(props: {
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

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (courseError || !course) {
    return notFound();
  }

  // Fetch modules and lessons
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select(`
      id,
      title,
      order_index,
      lessons (
        id,
        title,
        order_index,
        content
      )
    `)
    .eq('course_id', id)
    .order('order_index');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Course Banner */}
      <div className="bg-zinc-900 text-white overflow-hidden relative border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent p-6 pointer-events-none" />
        <div className="max-w-6xl mx-auto p-12 md:py-20 relative z-10 space-y-6">
          <Link href="/courses" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest italic group">
             <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
             Back to catalog
          </Link>
          <div className="space-y-2">
            <Badge className="bg-primary text-zinc-950 font-black border-none px-3 py-1 scale-110 -rotate-1 origin-left">{course.exam_type}</Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">{course.title}</h1>
            <p className="text-zinc-400 font-medium text-lg max-w-2xl">{course.description || "Master your English proficiency with this comprehensive guided program."}</p>
          </div>
          <div className="flex gap-4 items-center">
             <Button className="font-bold rounded-2xl h-12 px-8 shadow-xl shadow-primary/20">Enrol in program</Button>
             <div className="flex items-center gap-1 text-zinc-500 font-mono text-xs">
                <BookOpen className="w-4 h-4" />
                {modules?.length || 0} MODULES
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-20 grid gap-12 md:grid-cols-3">
         <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight border-l-4 border-primary pl-4 uppercase italic">Course Curriculum</h3>
              
              <div className="space-y-6">
                {(modules && modules.length > 0) ? (
                  modules.map((module: any) => (
                    <div key={module.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                       <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border-b border-zinc-100 flex items-center justify-between">
                          <h4 className="font-bold text-lg tracking-tight uppercase italic">{module.title}</h4>
                          <span className="text-[10px] font-black text-zinc-400 tracking-widest">{module.lessons?.length || 0} LESSONS</span>
                       </div>
                       <div className="p-2 space-y-1">
                          {module.lessons?.map((lesson: any) => (
                            <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="group flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border-b border-transparent hover:border-zinc-100 last:border-none">
                               <div className="flex items-center gap-4">
                                  <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg group-hover:bg-primary transition-colors">
                                    <Play className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 transition-colors uppercase italic">{lesson.title}</p>
                                    <p className="text-[10px] font-mono text-zinc-400 mt-1">[ PREVIEW AVAILABLE ]</p>
                                  </div>
                               </div>
                               <ChevronLeft className="w-4 h-4 text-zinc-300 rotate-180 transition-transform group-hover:translate-x-1" />
                            </Link>
                          ))}
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-zinc-100/50 rounded-3xl italic text-zinc-400 font-mono">
                    [ NO CONTENT ADDED FOR THIS COURSE YET ]
                  </div>
                )}
              </div>
            </section>
         </div>

         <aside className="space-y-8">
            <Card className="bg-white dark:bg-zinc-900 border-none shadow-xl rounded-3xl p-8 sticky top-28">
               <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 italic underline underline-offset-4 decoration-primary/30">Course Overview</h4>
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl text-primary font-black uppercase text-xs italic">IELTS</div>
                   <div>
                     <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Target Exam</p>
                     <p className="text-sm font-black italic">{course.exam_type}</p>
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                     Full Writing Feedback
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 opacity-50">
                     <Lock className="w-4 h-4" />
                     Speaking Practice
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 opacity-50">
                     <Lock className="w-4 h-4" />
                     Final Mock Test
                   </div>
                 </div>

                 <Button className="w-full font-black rounded-xl h-12 shadow-lg hover:shadow-primary/20">PREVIEW SYLLABUS</Button>
               </div>
            </Card>
         </aside>
      </div>
    </div>
  );
}
