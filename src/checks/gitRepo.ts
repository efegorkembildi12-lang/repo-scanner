import { CheckResult } from '../types.js';
import { GitInfo } from '../utils/git.js';

export function checkGitRepo(info: GitInfo): CheckResult {
  if (info.isRepo) {
    return {
      id: 'git-repo',
      name: 'Git Repository',
      category: 'Structure',
      status: 'PASS',
      message: 'Git repository detected',
      weight: 15,
    };
  }
  return {
    id: 'git-repo',
    name: 'Git Repository',
    category: 'Structure',
    status: 'FAIL',
    message: 'Not a git repository',
    suggestion: 'Run `git init` to initialize a repository',
    weight: 15,
  };
}
