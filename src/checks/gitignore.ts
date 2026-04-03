import { CheckResult } from '../types.js';
import { exists } from '../utils/fs.js';

export function checkGitignore(repoPath: string): CheckResult {
  if (exists(repoPath, '.gitignore')) {
    return {
      id: 'gitignore',
      name: '.gitignore',
      category: 'Security',
      status: 'PASS',
      message: '.gitignore found',
      weight: 10,
    };
  }
  return {
    id: 'gitignore',
    name: '.gitignore',
    category: 'Security',
    status: 'FAIL',
    message: 'No .gitignore file found',
    suggestion: 'Add a .gitignore to prevent committing build artifacts and secrets',
    weight: 10,
  };
}
