import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCourse } from "../../actions";
import { ChevronLeft, PlusCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/teacher/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-colors text-sm font-bold uppercase tracking-widest italic group">
           <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
           Back to Faculty Hub
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 underline underline-offset-8 decoration-indigo-600/20 italic">Course Creator</h1>
          <p className="text-zinc-500 font-medium">Build a new English proficiency program from scratch. Start with the core details.</p>
        </div>

        <Card className="bg-white border-zinc-100 shadow-xl rounded-3xl p-8">
          <form action={createCourse} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Course Title</Label>
              <Input id="title" name="title" placeholder="e.g. IELTS Foundation: Writing & Speaking" required className="h-12 rounded-xl text-lg font-bold" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_type" className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Target Exam</Label>
              <select id="exam_type" name="exam_type" className="w-full bg-white border-2 border-zinc-100 rounded-xl p-3 h-12 outline-none focus:border-indigo-500 font-bold" required>
                 <option value="IELTS">IELTS Academic</option>
                 <option value="TOEIC">TOEIC Listening & Reading</option>
                 <option value="General English">General English</option>
                 <option value="Business English">Business English</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Program Description</Label>
              <Textarea id="description" name="description" placeholder="Summarize the core goals and audience for this program..." className="min-h-[150px] rounded-2xl p-4 text-md" />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 h-14 rounded-2xl font-black text-lg uppercase italic tracking-tighter shadow-xl shadow-indigo-600/20 mt-8">
              INITIALIZE COURSE
              <PlusCircle className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
