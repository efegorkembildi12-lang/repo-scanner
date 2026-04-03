import * as fs from 'fs';
import * as path from 'path';
import { CheckResult } from '../types.js';
import { exists, readJsonFile } from '../utils/fs.js';

export function checkTests(repoPath: string): CheckResult {
  // Node: check package.json for a test script
  const pkgPath = path.join(repoPath, 'package.json');
  const pkg = readJsonFile(pkgPath) as { scripts?: Record<string, string> } | null;
  if (pkg?.scripts?.test && pkg.scripts.test !== 'echo "Error: no test specified" && exit 1') {
    return {
      id: 'tests',
      name: 'Tests',
      category: 'Quality',
      status: 'PASS',
      message: 'Test script found in package.json',
      weight: 10,
    };
  }

  // Python: check for test directories first
  const directSignals = ['tests', 'test', 'pytest.ini', 'setup.cfg', 'tox.ini'];
  for (const sig of directSignals) {
    if (exists(repoPath, sig)) {
      return {
        id: 'tests',
        name: 'Tests',
        category: 'Quality',
        status: 'PASS',
        message: `Test directory/config found (${sig})`,
        weight: 10,
      };
    }
  }

  // pyproject.toml: only PASS if it actually contains pytest config
  if (exists(repoPath, 'pyproject.toml')) {
    try {
      const content = fs.readFileSync(path.join(repoPath, 'pyproject.toml'), 'utf-8');
      if (content.includes('[tool.pytest') || content.includes('addopts') || content.includes('testpaths')) {
        return {
          id: 'tests',
          name: 'Tests',
          category: 'Quality',
          status: 'PASS',
          message: 'pytest config found in pyproject.toml',
          weight: 10,
        };
      }
    } catch {
      // unreadable — skip
    }
  }

  return {
    id: 'tests',
    name: 'Tests',
    category: 'Quality',
    status: 'WARN',
    message: 'No test setup detected',
    suggestion: 'Add a test script or test directory to validate your code',
    weight: 10,
  };
}
