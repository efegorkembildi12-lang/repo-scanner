import { simpleGit } from 'simple-git';

export interface GitInfo {
  isRepo: boolean;
  isDirty: boolean;
  trackedFiles: string[];
  lastCommitDate?: Date;
}

export async function getGitInfo(repoPath: string): Promise<GitInfo> {
  const git = simpleGit(repoPath);

  try {
    await git.revparse(['--git-dir']);
  } catch {
    return { isRepo: false, isDirty: false, trackedFiles: [] };
  }

  const [status, rawFiles, log] = await Promise.all([
    git.status(),
    git.raw(['ls-files']),
    git.log({ maxCount: 1 }).catch(() => null),
  ]);

  const trackedFiles = rawFiles.trim().split('\n').filter(Boolean);
  const lastCommitDate = log?.latest?.date ? new Date(log.latest.date) : undefined;

  return {
    isRepo: true,
    isDirty: !status.isClean(),
    trackedFiles,
    lastCommitDate,
  };
}
