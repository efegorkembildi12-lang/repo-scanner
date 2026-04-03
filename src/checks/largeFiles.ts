import * as fs from 'fs';
import * as path from 'path';
import { CheckResult } from '../types.js';
import { GitInfo } from '../utils/git.js';

const THRESHOLD_BYTES = 10 * 1024 * 1024; // 10 MB

function formatMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function checkLargeFiles(repoPath: string, info: GitInfo): CheckResult {
  const files = info.isRepo ? info.trackedFiles : [];

  const large: { file: string; size: number }[] = [];

  for (const f of files) {
    const fullPath = path.join(repoPath, f);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isFile() && stat.size >= THRESHOLD_BYTES) {
        large.push({ file: f, size: stat.size });
      }
    } catch {
      // file may have been deleted from disk
    }
  }

  if (large.length === 0) {
    return {
      id: 'large-files',
      name: 'Large Files',
      category: 'Structure',
      status: 'PASS',
      message: `No tracked files over ${formatMB(THRESHOLD_BYTES)}`,
      weight: 10,
    };
  }

  large.sort((a, b) => b.size - a.size);
  const preview = large
    .slice(0, 3)
    .map((f) => `${f.file} (${formatMB(f.size)})`)
    .join(', ');

  return {
    id: 'large-files',
    name: 'Large Files',
    category: 'Structure',
    status: 'WARN',
    message: `Large file(s) tracked: ${preview}${large.length > 3 ? ` (+${large.length - 3} more)` : ''}`,
    suggestion: 'Use Git LFS or exclude large binaries from the repository',
    weight: 10,
  };
}
