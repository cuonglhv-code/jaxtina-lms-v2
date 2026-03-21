import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save, Plus, Trash2, LayoutGrid, FileText, Activity } from "lucide-react";
import Link from 'next/link';

export default async function EditCoursePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();

  // Fetch course, modules, and lessons
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules (
        id,
        title,
        order_index,
        lessons (
          id,
          title,
          order_index
        )
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !course) return notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="space-y-4">
             <Link href="/teacher/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-colors text-sm font-bold uppercase tracking-widest italic group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
             </Link>
             <div className="flex items-center gap-3">
                <Badge className="bg-indigo-600 text-white border-none font-black italic rounded-lg tracking-widest px-3 py-1 scale-110">{course.exam_type}</Badge>
                <div className="h-4 w-[2px] bg-zinc-200" />
                <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest italic">Course Editor</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic">{course.title}</h1>
          </div>
          <div className="flex gap-2 pb-2">
             <Button variant="outline" className="rounded-2xl font-bold gap-2">
                <LayoutGrid className="w-4 h-4" /> Preview Course
             </Button>
             <Button className="rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 gap-2 px-6">
                <Save className="w-4 h-4" /> Finalize Changes
             </Button>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-12">
              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight border-l-4 border-indigo-600 pl-4 uppercase italic leading-none">Curriculum Structure</h3>
                    <Button variant="secondary" size="sm" className="font-bold underline underline-offset-4 decoration-indigo-600/30">ADD MODULE <Plus className="w-4 h-4 ml-1" /></Button>
                 </div>

                 <div className="space-y-8">
                   {course.modules?.map((module: any) => (
                     <div key={module.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden group">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border-b border-zinc-100 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black italic bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">M-{module.order_index}</span>
                              <h4 className="font-bold text-lg tracking-tight uppercase italic">{module.title}</h4>
                           </div>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                           </div>
                        </div>
                        <div className="p-4 space-y-2">
                           {module.lessons?.map((lesson: any) => (
                             <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-white border-2 border-transparent hover:border-zinc-100 transition-all font-bold text-sm italic uppercase tracking-tight text-zinc-600 group/lesson cursor-pointer">
                                <div className="flex items-center gap-4">
                                   <FileText className="w-4 h-4 text-zinc-400 group-hover/lesson:text-indigo-600" />
                                   {lesson.title}
                                </div>
                                <Activity className="w-4 h-4 text-zinc-300 group-hover/lesson:text-indigo-600 opacity-0 group-hover/lesson:opacity-100 transition-all" />
                             </div>
                           ))}
                           <Button variant="ghost" className="w-full text-xs font-bold text-zinc-400 hover:text-indigo-600 border-2 border-dashed border-zinc-100 hover:border-indigo-100 rounded-2xl py-6 mt-2">+ ADD LESSON TO THIS MODULE</Button>
                        </div>
                     </div>
                   ))}

                   {course.modules?.length === 0 && (
                      <div className="p-20 text-center bg-zinc-100/30 rounded-[3rem] border-2 border-dashed border-zinc-100 italic text-zinc-400">
                         [ NO MODULES ADDED YET ]
                      </div>
                   )}
                 </div>
              </section>
           </div>

           <aside className="space-y-8">
              <Card className="bg-zinc-900 text-white rounded-[2rem] p-8 border-none shadow-2xl space-y-6 sticky top-28 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent p-6 pointer-events-none" />
                 <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 italic underline underline-offset-4 decoration-indigo-500/30 relative">Program Metadata</h4>
                 
                 <div className="space-y-6 relative">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-zinc-500 uppercase">Description</Label>
                       <p className="text-xs font-medium text-zinc-400 italic">Course content will be automatically optimized for the selected exam target.</p>
                       <textarea className="w-full bg-zinc-800/50 rounded-xl p-4 text-xs font-bold text-white border-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]" defaultValue={course.description} />
                    </div>

                    <div className="h-[1px] bg-zinc-800/50" />
                    
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-zinc-500 uppercase">Estimated Hours</p>
                       <p className="text-xs font-mono font-black italic">42H</p>
                    </div>
                 </div>

                 <Button className="w-full bg-white text-zinc-950 font-black rounded-xl h-12 uppercase italic text-xs tracking-widest relative">DELETION ZONE</Button>
              </Card>
           </aside>
        </div>
      </div>
    </div>
  );
}
