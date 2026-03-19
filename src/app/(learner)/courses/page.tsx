import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CourseCard } from "@/components/courses/course-card";
import { Search, SlidersHorizontal, GraduationCap, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut } from "../../(auth)/actions";
import { Badge } from "@/components/ui/badge";

export default async function CourseCatalogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch all available courses from Supabase
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('title');

  const hasCourses = courses && courses.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Shared Nav */}
      <nav className="border-b bg-white dark:bg-zinc-900 sticky top-0 z-10 box-border p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="w-5 h-5 text-zinc-950" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-zinc-900 italic">Jaxtina LMS</h1>
          </Link>
          <div className="flex items-center gap-4 text-zinc-500">
             <form action={signOut}>
               <Button variant="ghost" size="sm" className="gap-2">
                 <LogOut className="w-4 h-4" /> Sign Out
               </Button>
             </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        <div className="space-y-4">
          <Badge className="font-bold border-none bg-indigo-600/10 text-indigo-600">Browse Programs</Badge>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 underline underline-offset-8 decoration-primary/20">Course Catalog</h1>
          <p className="text-zinc-500 font-medium max-w-xl">Find the perfect English proficiency program to reach your goals, from IELTS Academic to General English.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1 group">
             <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-primary" />
             <input
               className="w-full bg-white border-2 border-zinc-100 rounded-2xl p-3 pl-10 h-12 focus:border-primary/50 outline-none transition-all shadow-sm"
               placeholder="Search for courses (e.g. IELTS Writing)..."
             />
           </div>
           <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold px-6">
             <SlidersHorizontal className="w-5 h-5" />
             Filters
           </Button>
        </div>

        {hasCourses ? (
          <div className="grid gap-6 md:grid-cols-3">
             {courses.map((course: any) => (
               <CourseCard
                 key={course.id}
                 id={course.id}
                 title={course.title}
                 className={course.exam_type || 'General English'}
                 progress={0}
               />
             ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-zinc-100 italic text-zinc-400">
             <p>[ CATALOG CURRENTLY EMPTY ]</p>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';
