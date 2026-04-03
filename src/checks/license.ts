import * as fs from 'fs';
import * as path from 'path';
import { CheckResult } from '../types.js';

const LICENSE_NAMES = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE', 'COPYING'];

export function checkLicense(repoPath: string): CheckResult {
  const found = LICENSE_NAMES.find((name) => fs.existsSync(path.join(repoPath, name)));

  if (found) {
    return {
      id: 'license',
      name: 'License',
      category: 'Documentation',
      status: 'PASS',
      message: `License file found (${found})`,
      weight: 5,
    };
  }
  return {
    id: 'license',
    name: 'License',
    category: 'Documentation',
    status: 'WARN',
    message: 'No license file found',
    suggestion: 'Add a LICENSE file so others know how they can use your project',
    weight: 5,
  };
}
