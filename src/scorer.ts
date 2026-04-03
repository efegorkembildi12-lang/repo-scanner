import { CheckResult, HealthReport } from './types.js';

export function score(
  repoPath: string,
  results: CheckResult[],
  strict = false
): HealthReport {
  const multiplier = { PASS: 1, WARN: strict ? 0 : 0.5, FAIL: 0 };

  let earned = 0;
  let maxScore = 0;
  const suggestions: string[] = [];

  for (const r of results) {
    maxScore += r.weight;
    earned += r.weight * multiplier[r.status];
    if (r.suggestion && r.status !== 'PASS') {
      suggestions.push(r.suggestion);
    }
  }

  const percentage = maxScore === 0 ? 0 : Math.round((earned / maxScore) * 100);

  return {
    repoPath,
    score: Math.round(earned),
    maxScore,
    percentage,
    results,
    suggestions,
  };
}
