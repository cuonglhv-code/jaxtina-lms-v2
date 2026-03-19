'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIAssistantProps {
  content: string;
  type: string;
  instructions: string;
  onApplyFeedback: (score: number, feedback: string) => void;
}

interface AIFeedback {
  score: number;
  overall_feedback: string;
}

export function AIAssistant({ content, type, instructions, onApplyFeedback }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type, instructions }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(data);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Failed to generate AI feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!feedback ? (
        <Button 
          onClick={generateFeedback} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black rounded-xl h-12 uppercase italic text-xs tracking-widest shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with Claude...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Draft
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <Alert className="bg-emerald-500/10 border-emerald-500/20 border-2 rounded-2xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertTitle className="text-emerald-500 font-black uppercase text-[10px] tracking-widest italic">AI Draft Ready</AlertTitle>
            <AlertDescription className="text-zinc-400 text-xs font-medium mt-1">
              Claude suggested an initial score of <span className="text-emerald-500 font-black">{feedback.score}</span>.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={() => onApplyFeedback(feedback.score, feedback.overall_feedback)}
            variant="outline"
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl font-bold text-xs uppercase italic"
          >
            Apply Draft to Form
          </Button>
          
          <Button 
            onClick={() => setFeedback(null)}
            variant="ghost" 
            className="w-full text-zinc-500 text-[10px] hover:text-zinc-400 font-bold uppercase italic"
          >
            Reset AI
          </Button>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 font-bold uppercase italic text-center px-4">{error}</p>
      )}
    </div>
  );
}
