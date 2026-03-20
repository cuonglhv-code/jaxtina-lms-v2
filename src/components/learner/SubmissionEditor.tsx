'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CheckCircle2, CloudUpload, Clock, Save, AlertCircle } from "lucide-react";
import { saveDraftAction, submitEssayAction } from "@/app/(learner)/actions";

interface SubmissionEditorProps {
  activityId: string;
  initialContent?: string;
  minWords?: number;
}

export function SubmissionEditor({ 
  activityId, 
  initialContent = '', 
  minWords = 150 
}: SubmissionEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'submitting' | 'submitted' | 'error'>('idle');
  const [wordCount, setWordCount] = useState(0);

  // Update word count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  // Auto-save logic
  const handleAutoSave = useCallback(async () => {
    if (!content || status === 'submitted') return;
    
    setStatus('saving');
    try {
      await saveDraftAction(activityId, content);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Auto-save failed:', err);
      setStatus('error');
    }
  }, [activityId, content, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simple check to see if content changed from initial
      if (content !== initialContent && status === 'idle' && content.length > 0) {
        handleAutoSave();
      }
    }, 10000); // Auto-save after 10 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, handleAutoSave, initialContent, status]);

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      await submitEssayAction(activityId, content);
      setStatus('submitted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      alert(errorMessage);
      setStatus('idle');
    }
  };

  if (status === 'submitted') {
    return (
      <Card className="p-12 text-center space-y-6 bg-white dark:bg-zinc-900 rounded-[3rem] border-none shadow-2xl">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto scale-125">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter">ESSAY SUBMITTED!</h2>
          <p className="text-zinc-500 font-medium">Your work is now in the queue for review.</p>
        </div>
        <Button asChild className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-14 px-8 font-bold italic">
          <a href="/learner/dashboard">RETURN TO DASHBOARD</a>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Word Count</span>
            <span className={`text-2xl font-black italic leading-none ${wordCount < minWords ? 'text-orange-500' : 'text-emerald-500'}`}>
              {wordCount} <span className="text-sm text-zinc-400 font-bold not-italic">/ {minWords}</span>
            </span>
          </div>
          <div className="h-8 w-[1px] bg-zinc-200" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Status</span>
            <div className="flex items-center gap-2 mt-1">
              {status === 'saving' && <CloudUpload size={14} className="text-indigo-500 animate-pulse" />}
              {status === 'saved' && <Save size={14} className="text-emerald-500" />}
              {status === 'error' && <AlertCircle size={14} className="text-red-500" />}
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
                {status === 'saving' ? 'Saving Draft...' : status === 'saved' ? 'Draft Saved' : status === 'error' ? 'Save Error' : 'All changes saved locally'}
              </span>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={status === 'submitting' || wordCount < 10}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black italic rounded-2xl px-10 h-16 shadow-xl shadow-indigo-600/20 uppercase tracking-tighter text-lg"
        >
          {status === 'submitting' ? 'Submitting...' : 'SUBMIT ESSAY'}
        </Button>
      </div>

      <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden ring-1 ring-black/5 bg-white dark:bg-zinc-900">
        <Textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your essay here..."
          className="min-h-[600px] w-full p-12 text-xl font-medium leading-relaxed border-none focus-visible:ring-0 resize-none bg-transparent placeholder:text-zinc-300 dark:placeholder:text-zinc-700 italic"
        />
      </Card>

      <div className="flex items-center justify-start gap-3 px-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
        <Clock size={12} />
        Timed Practice: 40:00 Remaining
      </div>
    </div>
  );
}
