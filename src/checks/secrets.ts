import { CheckResult } from '../types.js';
import { GitInfo } from '../utils/git.js';

// Patterns that suggest a tracked secret
const SECRET_PATTERNS = [
  /^\.env$/i,
  /^\.env\.(local|production|staging|development)$/i,
  /\.pem$/i,
  /\.key$/i,
  /^id_rsa$/i,
  /^id_dsa$/i,
  /^id_ecdsa$/i,
  /^id_ed25519$/i,
  /\.pfx$/i,
  /\.p12$/i,
  /^credentials\.json$/i,
  /^secrets\.json$/i,
  /^secrets\.yaml$/i,
  /^secrets\.yml$/i,
  /service[-_]account.*\.json$/i,
  /^\.netrc$/i,
  /^\.npmrc$/i,
  /^auth\.json$/i,
];

export function checkSecrets(info: GitInfo): CheckResult {
  if (!info.isRepo) {
    return {
      id: 'secrets',
      name: 'Tracked Secrets',
      category: 'Security',
      status: 'WARN',
      message: 'Cannot check tracked secrets — not a git repository',
      weight: 15,
    };
  }

  const hits = info.trackedFiles.filter((f) => {
    const basename = f.split('/').pop() ?? f;
    return SECRET_PATTERNS.some((re) => re.test(basename));
  });

  if (hits.length === 0) {
    return {
      id: 'secrets',
      name: 'Tracked Secrets',
      category: 'Security',
      status: 'PASS',
      message: 'No tracked secret files detected',
      weight: 15,
    };
  }

  return {
    id: 'secrets',
    name: 'Tracked Secrets',
    category: 'Security',
    status: 'FAIL',
    message: `Potential secret files tracked in git: ${hits.slice(0, 3).join(', ')}${hits.length > 3 ? ` (+${hits.length - 3} more)` : ''}`,
    suggestion: 'Remove secret files from git history and add them to .gitignore',
    weight: 15,
  };
}
