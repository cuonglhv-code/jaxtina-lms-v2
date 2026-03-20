/**
 * Strict schema for the AI's IELTS writing evaluation.
 * Used for both JSON validation and TypeScript safety.
 */
export interface IELTSEvaluation {
  overallBand: number; // e.g., 6.5 or 7.0
  analysis: {
    taskResponse: { score: number; feedback: string };
    coherenceCohesion: { score: number; feedback: string };
    lexicalResource: { score: number; feedback: string };
    grammaticalRange: { score: number; feedback: string };
  };
  keyImprovements: string[]; // At least 3 specific, actionable points
  modelSummary: string; // Internal examiner notes for the human teacher
}
