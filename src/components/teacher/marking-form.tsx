'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Star, MessageSquareQuote, CheckCircle2, Sparkles } from "lucide-react";
import { finalizeMarkingAction } from "@/app/(teacher)/actions";
import { Submission, Activity } from "@/types/database";

interface MarkingFormProps {
  submission: Submission & { activities: Activity };
}

export function MarkingForm({ submission }: MarkingFormProps) {
  // AI Suggestions are already in submission.scores and submission.feedback (draft mode)
  const initialScore = submission.scores?.[0]?.score?.toString() || '';
  const initialFeedback = submission.feedback?.[0]?.content || '';

  const [score, setScore] = useState(initialScore);
  const [feedback, setFeedback] = useState(initialFeedback);

  return (
    <aside className="space-y-8">
      <Card className="bg-zinc-900 text-white rounded-[3rem] p-8 border-none shadow-2xl space-y-8 sticky top-28 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent p-6 pointer-events-none" />
        
        <div className="flex items-center justify-between relative">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic underline underline-offset-4 decoration-indigo-500/30">
            Examiner Console
          </h4>
          {initialScore && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-400 animate-pulse">
              <Sparkles size={10} />
              AI DRAFT LOADED
            </div>
          )}
        </div>
        
        <form action={finalizeMarkingAction} className="space-y-8 relative">
          <input type="hidden" name="submission_id" value={submission.id} />
          
          <div className="space-y-4">
            <Label htmlFor="score" className="text-[10px] font-black italic uppercase text-zinc-500 flex items-center justify-between">
              Final Band Score
              <Star className="w-3 h-3 text-indigo-500" />
            </Label>
            <Input 
              id="score" 
              name="score" 
              type="number" 
              step="0.5" 
              min="0" 
              max="9" 
              placeholder="e.g. 7.5" 
              required
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="h-16 rounded-3xl bg-zinc-800 border-none text-3xl font-black text-white text-center italic focus-visible:ring-indigo-500/30" 
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="feedback" className="text-[10px] font-black italic uppercase text-zinc-500 flex items-center justify-between">
              Final Feedback
              <MessageSquareQuote className="w-3 h-3 text-zinc-600" />
            </Label>
            <Textarea 
              id="feedback" 
              name="feedback" 
              required 
              placeholder="Refine the feedback points..." 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[300px] bg-zinc-800 border-none rounded-3xl p-6 text-sm font-semibold text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-indigo-500/30 leading-relaxed italic" 
            />
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl h-16 uppercase italic text-lg tracking-tighter shadow-2xl shadow-indigo-600/20">
            FINALIZE & REVEAL
            <CheckCircle2 className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </Card>
    </aside>
  );
}
