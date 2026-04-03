import * as fs from 'fs';
import * as path from 'path';

export function exists(repoPath: string, ...segments: string[]): boolean {
  return fs.existsSync(path.join(repoPath, ...segments));
}

export function readJsonFile(filePath: string): Record<string, unknown> | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}
