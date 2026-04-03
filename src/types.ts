export type CheckStatus = 'PASS' | 'WARN' | 'FAIL';
export type CheckCategory = 'Documentation' | 'Security' | 'Quality' | 'Structure';

export interface CheckResult {
  id: string;
  name: string;
  category: CheckCategory;
  status: CheckStatus;
  message: string;
  suggestion?: string;
  weight: number;
}

export interface HealthReport {
  repoPath: string;
  score: number;
  maxScore: number;
  percentage: number;
  results: CheckResult[];
  suggestions: string[];
}

export interface AnalyzeOptions {
  strict?: boolean;
  configPath?: string;
  htmlOutput?: string;
}

export interface RepoHealthConfig {
  rules?: Partial<Record<string, { weight?: number; enabled?: boolean }>>;
}
