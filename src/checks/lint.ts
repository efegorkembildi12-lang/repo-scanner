import { CheckResult } from '../types.js';
import { exists } from '../utils/fs.js';

const LINT_SIGNALS = [
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  'eslint.config.js',
  'eslint.config.mjs',
  '.prettierrc',
  '.prettierrc.js',
  '.prettierrc.json',
  '.prettierrc.yaml',
  'prettier.config.js',
  '.ruff.toml',
  'ruff.toml',
  '.flake8',
  '.pylintrc',
  'pyproject.toml',
];

export function checkLint(repoPath: string): CheckResult {
  const found = LINT_SIGNALS.find((sig) => exists(repoPath, sig));

  if (found) {
    return {
      id: 'lint',
      name: 'Lint / Format',
      category: 'Quality',
      status: 'PASS',
      message: `Lint/format config found (${found})`,
      weight: 5,
    };
  }
  return {
    id: 'lint',
    name: 'Lint / Format',
    category: 'Quality',
    status: 'WARN',
    message: 'No lint or format config detected',
    suggestion: 'Add ESLint/Prettier (JS) or Ruff/Black (Python) to enforce code style',
    weight: 5,
  };
}
