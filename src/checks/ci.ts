import { CheckResult } from '../types.js';
import { exists } from '../utils/fs.js';

const CI_SIGNALS = [
  '.github/workflows',
  '.gitlab-ci.yml',
  '.circleci/config.yml',
  'Jenkinsfile',
  '.travis.yml',
  'bitbucket-pipelines.yml',
  '.drone.yml',
  'azure-pipelines.yml',
];

export function checkCI(repoPath: string): CheckResult {
  const found = CI_SIGNALS.find((sig) => exists(repoPath, sig));

  if (found) {
    return {
      id: 'ci',
      name: 'CI Config',
      category: 'Quality',
      status: 'PASS',
      message: `CI config found (${found})`,
      weight: 10,
    };
  }
  return {
    id: 'ci',
    name: 'CI Config',
    category: 'Quality',
    status: 'WARN',
    message: 'No CI configuration found',
    suggestion: 'Add a CI workflow (e.g. GitHub Actions) to automate tests and builds',
    weight: 10,
  };
}
