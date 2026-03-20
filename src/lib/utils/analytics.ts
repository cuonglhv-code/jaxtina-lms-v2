/**
 * Core analytical logic for calculating academic performance 
 * and AI reliability metrics.
 */

/**
 * Calculates the mean average of a numeric array.
 */
export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return parseFloat((sum / scores.length).toFixed(1));
}

interface HumanScore {
  submission_id: string;
  score: number;
}

interface AILog {
  submission_id: string;
  response: string;
}

/**
 * Calculates the Mean Absolute Error (MAE) between human and AI scores.
 * The lower the MAE, the higher the AI's standard-matching accuracy.
 */
export function calculateAIAccuracy(
  humanScores: HumanScore[],
  aiLogs: AILog[]
): { mae: number; accuracyPercent: number } {
  let totalDelta = 0;
  let count = 0;

  humanScores.forEach(human => {
    const aiLog = aiLogs.find(log => log.submission_id === human.submission_id);
    if (aiLog) {
      try {
        const aiData = JSON.parse(aiLog.response);
        const aiScore = aiData.overallBand;
        if (typeof aiScore === 'number') {
          totalDelta += Math.abs(human.score - aiScore);
          count++;
        }
      } catch (e) {
        console.error('Failed to parse AI log response during analytics calculation:', e);
      }
    }
  });

  if (count === 0) return { mae: 0, accuracyPercent: 100 };

  const mae = totalDelta / count;
  // Accuracy % benchmark: 9.0 is the max IELTS range. 
  const accuracyPercent = Math.max(0, 100 - (mae / 9) * 100);

  return { 
    mae: parseFloat(mae.toFixed(2)), 
    accuracyPercent: parseFloat(accuracyPercent.toFixed(1)) 
  };
}
