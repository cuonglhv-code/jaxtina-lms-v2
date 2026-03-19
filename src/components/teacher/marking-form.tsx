'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { AIAssistant } from "./ai-assistant";
import { submitMarking } from "@/app/(teacher)/actions";
import { Submission, Activity } from "@/types/database";

interface MarkingFormProps {
  submission: Submission & { activities: Activity };
}

export function MarkingForm({ submission }: MarkingFormProps) {
  const [score, setScore] = useState(submission.score?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const applyAIDraft = (aiScore: number, aiFeedback: string) => {
    setScore(aiScore.toString());
    setFeedback(aiFeedback);
  };

  return (
    <aside className="space-y-8">
      <Card className="bg-zinc-900 text-white rounded-[3rem] p-8 border-none shadow-2xl space-y-8 sticky top-28 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent p-6 pointer-events-none" />
        <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 italic underline underline-offset-4 decoration-orange-500/30 relative">Grade and Feedback</h4>
        
        <form action={submitMarking} className="space-y-8 relative">
          <input type="hidden" name="submission_id" value={submission.id} />
          
          <div className="space-y-4">
            <Label htmlFor="score" className="text-[10px] font-black italic uppercase text-zinc-500 flex items-center justify-between">
              Target Score / Band
              <Star className="w-3 h-3 text-orange-500" />
            </Label>
            <Input 
              id="score" 
              name="score" 
              type="number" 
              step="0.5" 
              min="0" 
              max="100" 
              placeholder="e.g. 7.5" 
              required
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="h-16 rounded-3xl bg-zinc-800 border-none text-3xl font-black text-white text-center italic" 
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="feedback" className="text-[10px] font-black italic uppercase text-zinc-500 flex items-center justify-between">
              Teacher Comments
              <MessageSquareQuote className="w-3 h-3 text-zinc-600" />
            </Label>
            <Textarea 
              id="feedback" 
              name="feedback" 
              required 
              placeholder="Provide specific feedback..." 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[200px] bg-zinc-800 border-none rounded-3xl p-6 text-sm font-semibold text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-emerald-500/30" 
            />
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl h-16 uppercase italic text-lg tracking-tighter shadow-2xl shadow-orange-600/20">
            FINALIZE SCORE
            <CheckCircle2 className="w-5 h-5 ml-2" />
          </Button>
        </form>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 relative">
          <p className="text-[10px] font-black uppercase italic tracking-widest text-zinc-500">AI ASSISTANCE (CLAUDE)</p>
          <AIAssistant 
            content={submission.content || ''} 
            type={submission.activities.type} 
            instructions={submission.activities.instructions || ''}
            onApplyFeedback={applyAIDraft}
          />
        </div>
      </Card>
    </aside>
  );
}
