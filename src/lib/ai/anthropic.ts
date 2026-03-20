import Anthropic from '@anthropic-ai/sdk';
import { IELTSEvaluation } from '@/types/ai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Sends the student's essay to Claude for evaluation.
 * Enforces strict JSON output to match the IELTSEvaluation interface.
 */
export async function generateIELTSFeedback(
  taskInstructions: string,
  studentContent: string
): Promise<IELTSEvaluation> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is missing from environment variables');
  }

  const systemPrompt = `
    You are a professional IELTS Writing Examiner. You will evaluate the provided student response against the four official criteria:
    1. Task Response (or Task Achievement)
    2. Coherence and Cohesion
    3. Lexical Resource
    4. Grammatical Range and Accuracy

    Your output MUST be a single, valid JSON object following this interface:
    {
      "overallBand": number,
      "analysis": {
        "taskResponse": { "score": number, "feedback": "string" },
        "coherenceCohesion": { "score": number, "feedback": "string" },
        "lexicalResource": { "score": number, "feedback": "string" },
        "grammaticalRange": { "score": number, "feedback": "string" }
      },
      "keyImprovements": ["string"],
      "modelSummary": "string"
    }

    Rules:
    - Use half-bands for scores (e.g., 6.0, 6.5, 7.0).
    - Feedback must be professional, encouraging but direct.
    - Provide exactly 3-4 key improvements.
    - Output ONLY the raw JSON object. No preamble or markdown code blocks.
  `;

  const userMessage = `
    TASK INSTRUCTIONS:
    ${taskInstructions}

    STUDENT ESSAY:
    ${studentContent}
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2000,
      temperature: 0, // Ensure factual consistency and strict format adherence
      system: systemPrompt.trim(),
      messages: [{ role: 'user', content: userMessage.trim() }],
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== 'text') {
      throw new Error('AI returned an unexpected content type');
    }

    const evaluation: IELTSEvaluation = JSON.parse(contentBlock.text);
    return evaluation;
  } catch (err) {
    console.error('Claude Evaluation Error:', err);
    throw new Error(err instanceof Error ? err.message : 'AI Evaluation failed');
  }
}
