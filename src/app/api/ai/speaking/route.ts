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

    const { transcript, task_topic } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert IELTS and TOEIC Speaking examiner.
    Analyze the following speaking transcript and provide feedback in JSON format.
    Fields in JSON:
    - estimated_score: (Numeric band or index)
    - fluency_and_coherence: (Short summary)
    - lexical_resource: (Vocabulary quality)
    - grammatical_range_and_accuracy: (Specific feedback)
    - pronunciation_notes: (Observations from transcript, like filler words)
    - improved_expressions: (Specific lists)
    
    Topic: ${task_topic || 'Prompt unavailable'}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Faster and perfect for analysis
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: transcript }],
    });

    const feedbackText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    try {
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
      const feedbackJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };

      await supabase.from('ai_feedback_logs').insert({
        student_id: user.id,
        content: transcript,
        feedback: feedbackJson,
        type: 'speaking'
      });

      return NextResponse.json(feedbackJson);
    } catch (parseError) {
      console.error('JSON Parsing error:', parseError);
      return NextResponse.json({ raw_text: feedbackText });
    }

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Claude API Error:', err);
    return NextResponse.json({ error: err.message || 'AI service unavailable' }, { status: 500 });
  }
}
