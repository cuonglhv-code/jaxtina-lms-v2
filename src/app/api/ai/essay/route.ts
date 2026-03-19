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

    const { content, type, instructions } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert English examiner for IELTS and TOEIC.
    Provide detailed feedback on the student's writing submission.
    Structure your response in JSON format with the following keys:
    - score: (Estimated band or score)
    - overall_feedback: (General summary)
    - strengths: (List of points)
    - areas_for_improvement: (List of points)
    - grammar_corrections: (Specific examples with "original" and "corrected" fields)
    - vocabulary_suggestions: (Specific examples)
    
    Rubric Type: ${type || 'General English'}
    Task Instructions: ${instructions || 'N/A'}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opuses-20240229', // or claude-3-5-sonnet-20240620
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: content }],
    });

    // Extract content from Claude's response
    // Claude's response text needs to be parsed as JSON.
    const feedbackText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    try {
      // Find JSON block if Claude adds extra text
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
      const feedbackJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };
      
      // Log the feedback for auditing
      await supabase.from('ai_feedback_logs').insert({
        student_id: user.id,
        content: content,
        feedback: feedbackJson,
        type: type || 'essay'
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
