import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  className: string;
  schedule?: string;
  instructor?: string;
  progress?: number;
}

export function CourseCard({ id, title, className, schedule, instructor, progress = 0 }: CourseCardProps) {
  return (
    <Card className="overflow-hidden border border-zinc-200 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
            Active Class
          </Badge>
          <BookOpen className="w-4 h-4 text-zinc-400" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight line-clamp-1">{className}</CardTitle>
        <CardDescription className="text-xs font-medium text-zinc-500">{title}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
             <Calendar className="w-4 h-4" />
             <span>{schedule || 'Schedule TBD'}</span>
           </div>
           <p className="text-xs text-zinc-500">Instructor: {instructor || 'To be assigned'}</p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-zinc-500 italic lowercase tracking-tight">course progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full group">
          <Link href={`/courses/${id}`} className="flex items-center justify-center gap-2">
            Enter Classroom
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
