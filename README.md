# repo-health

**Fast, local git repo health scanner.**  
Scans any repository and gives you a score + actionable findings — no sign-up, no network calls, no AI.

```
npx repohealth .
```

---

## Example output

```
╭──────────────────────────────────────────────────────────────╮
│  repo-health  /home/user/my-project                          │
╰──────────────────────────────────────────────────────────────╯

  DOCUMENTATION
  ✓  README found (README.md)
  ●  No license file found

  SECURITY
  ✓  .gitignore found
  ✗  Potential secret files tracked in git: .env

  QUALITY
  ✓  Test script found in package.json
  ●  No CI configuration found
  ✓  Lint/format config found (.eslintrc.json)

  STRUCTURE
  ✓  Git repository detected
  ✓  Lockfile found (package-lock.json)
  ✓  No tracked files over 10 MB

  ────────────────────────────────────────────────────────────
    Score   ████████████████░░░░░░░░   68/100   Fair
  ────────────────────────────────────────────────────────────

  Suggestions:
    → Add a LICENSE file so others know how they can use your project
    → Add a CI workflow (e.g. GitHub Actions) to automate tests and builds
    → Remove secret files from git history and add them to .gitignore
```

---

## Install

**One-off scan (no install needed):**
```bash
npx repohealth .
```

**Global install:**
```bash
npm install -g repohealth
repo-health .
```

---

## Usage

```bash
# Scan current directory
repo-health .

# Scan a specific path
repo-health /path/to/repo

# Machine-readable JSON output
repo-health . --json

# Strict mode — WARNs count as zero points (useful in CI)
repo-health . --strict

# Custom rule weights via config file
repo-health . --config repo-health.json

# Generate a shareable HTML report
repo-health . --html report.html
```

---

## Checks

10 checks across 4 categories. Each has a weight; the final score is 0–100.

| # | Category | Check | Weight | PASS | WARN | FAIL |
|---|---|---|:---:|---|---|---|
| 1 | Documentation | README | 10 | exists & non-empty | too short | missing |
| 2 | Documentation | License | 5 | LICENSE file found | missing | — |
| 3 | Security | Tracked secrets | 15 | no secret files in git | — | `.env`, keys, certs tracked |
| 4 | Security | .gitignore | 10 | exists | — | missing |
| 5 | Quality | Tests | 10 | test script / dir found | none detected | — |
| 6 | Quality | Lint / Format | 5 | ESLint/Prettier/Ruff config | none detected | — |
| 7 | Quality | CI config | 10 | GitHub Actions / GitLab CI etc. | none detected | — |
| 8 | Structure | Git repo | 15 | valid `.git` directory | — | not a repo |
| 9 | Structure | Lockfile | 10 | lockfile found | manifest without lockfile | — |
| 10 | Structure | Large files | 10 | no tracked files > 10 MB | large files tracked | — |

**Scoring:** `PASS = weight × 1.0`, `WARN = weight × 0.5`, `FAIL = weight × 0`

---

## Config file

Create a `repo-health.json` to override weights or disable checks:

```json
{
  "rules": {
    "license":  { "enabled": false },
    "ci":       { "weight": 15 },
    "secrets":  { "weight": 20 }
  }
}
```

Then run:
```bash
repo-health . --config repo-health.json
```

---

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Score ≥ 50 |
| `1` | Score < 50 |
| `2` | Unexpected error |

This makes `repo-health --strict` a useful CI gate:

```yaml
# .github/workflows/health.yml
- name: Check repo health
  run: npx repohealth . --strict
```

---

## Philosophy

- **Free** — no accounts, no tokens
- **Local-first** — reads only your filesystem and git history
- **Fast** — typically < 1 second
- **Honest** — gives you a real score, not just green checkmarks

---

## License

MIT © Efe Görkem Bildi
