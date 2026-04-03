import * as fs from 'fs';
import * as path from 'path';
import { CheckResult } from '../types.js';

const README_NAMES = ['README.md', 'README.MD', 'README.rst', 'README.txt', 'README'];

export function checkReadme(repoPath: string): CheckResult {
  const found = README_NAMES.find((name) => fs.existsSync(path.join(repoPath, name)));

  if (!found) {
    return {
      id: 'readme',
      name: 'README',
      category: 'Documentation',
      status: 'FAIL',
      message: 'No README file found',
      suggestion: 'Add a README.md explaining the project',
      weight: 10,
    };
  }

  const size = fs.statSync(path.join(repoPath, found)).size;
  if (size < 100) {
    return {
      id: 'readme',
      name: 'README',
      category: 'Documentation',
      status: 'WARN',
      message: `README found but very short (${size} bytes) — likely a placeholder`,
      suggestion: 'Flesh out README with project description, setup, and usage',
      weight: 10,
    };
  }

  return {
    id: 'readme',
    name: 'README',
    category: 'Documentation',
    status: 'PASS',
    message: `README found (${found})`,
    weight: 10,
  };
}
