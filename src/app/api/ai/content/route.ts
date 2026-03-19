import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import anthropic from '@/lib/anthropic';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role check: Only teachers or admins
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role === 'student') {
      return NextResponse.json({ error: 'Access denied: Teacher or Admin only' }, { status: 403 });
    }

    const { prompt, content_type } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert curriculum designer and educator for IELTS and TOEIC programs.
    Your task is to help the teacher generate high-quality educational content.
    Content category: ${content_type || 'General English Lesson Content'}.
    Please provide well-structured content, optionally formatted with markdown.
    If generating a quiz, include the correct answers.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiContent = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ content: aiContent });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Claude API Error:', err);
    return NextResponse.json({ error: err.message || 'AI service unavailable' }, { status: 500 });
  }
}
