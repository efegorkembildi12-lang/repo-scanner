import * as fs from 'fs';
import * as path from 'path';
import { getGitInfo } from './utils/git.js';
import { score } from './scorer.js';
import { renderHtml } from './utils/html.js';
import { checkGitRepo } from './checks/gitRepo.js';
import { checkReadme } from './checks/readme.js';
import { checkGitignore } from './checks/gitignore.js';
import { checkLicense } from './checks/license.js';
import { checkTests } from './checks/tests.js';
import { checkLint } from './checks/lint.js';
import { checkCI } from './checks/ci.js';
import { checkLockfile } from './checks/lockfile.js';
import { checkSecrets } from './checks/secrets.js';
import { checkLargeFiles } from './checks/largeFiles.js';
import { AnalyzeOptions, CheckResult, HealthReport, RepoHealthConfig } from './types.js';
import { readJsonFile } from './utils/fs.js';

function applyConfig(results: CheckResult[], config: RepoHealthConfig): CheckResult[] {
  if (!config.rules) return results;
  return results
    .filter((r) => config.rules![r.id]?.enabled !== false)
    .map((r) => {
      const override = config.rules![r.id];
      if (override?.weight !== undefined) {
        return { ...r, weight: override.weight };
      }
      return r;
    });
}

export async function analyzeRepo(
  inputPath: string,
  options: AnalyzeOptions = {}
): Promise<HealthReport> {
  const repoPath = path.resolve(inputPath);
  const gitInfo = await getGitInfo(repoPath);

  let results = [
    checkGitRepo(gitInfo),
    checkReadme(repoPath),
    checkGitignore(repoPath),
    checkLicense(repoPath),
    checkTests(repoPath),
    checkLint(repoPath),
    checkCI(repoPath),
    checkLockfile(repoPath),
    checkSecrets(gitInfo),
    checkLargeFiles(repoPath, gitInfo),
  ];

  if (options.configPath) {
    const raw = readJsonFile(path.resolve(options.configPath));
    if (raw) {
      results = applyConfig(results, raw as RepoHealthConfig);
    }
  }

  const report = score(repoPath, results, options.strict);

  if (options.htmlOutput) {
    const html = renderHtml(report);
    fs.writeFileSync(path.resolve(options.htmlOutput), html, 'utf-8');
  }

  return report;
}
