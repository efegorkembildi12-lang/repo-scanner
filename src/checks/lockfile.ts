import { CheckResult } from '../types.js';
import { exists } from '../utils/fs.js';

export function checkLockfile(repoPath: string): CheckResult {
  const hasPackageJson = exists(repoPath, 'package.json');
  const hasRequirements = exists(repoPath, 'requirements.txt');
  const hasPyproject = exists(repoPath, 'pyproject.toml');

  if (!hasPackageJson && !hasRequirements && !hasPyproject) {
    return {
      id: 'lockfile',
      name: 'Lockfile',
      category: 'Structure',
      status: 'WARN',
      message: 'No dependency manifest found (package.json / requirements.txt)',
      suggestion: 'Add a dependency manifest to make the project reproducible',
      weight: 10,
    };
  }

  if (hasPackageJson) {
    const lockfiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'];
    const found = lockfiles.find((lf) => exists(repoPath, lf));
    if (found) {
      return {
        id: 'lockfile',
        name: 'Lockfile',
        category: 'Structure',
        status: 'PASS',
        message: `Lockfile found (${found})`,
        weight: 10,
      };
    }
    return {
      id: 'lockfile',
      name: 'Lockfile',
      category: 'Structure',
      status: 'WARN',
      message: 'package.json found but no lockfile (package-lock.json / yarn.lock / pnpm-lock.yaml)',
      suggestion: 'Commit your lockfile to ensure reproducible installs',
      weight: 10,
    };
  }

  // Python: requirements.txt or pyproject.toml is close enough
  return {
    id: 'lockfile',
    name: 'Lockfile',
    category: 'Structure',
    status: 'PASS',
    message: 'Python dependency file found',
    weight: 10,
  };
}
