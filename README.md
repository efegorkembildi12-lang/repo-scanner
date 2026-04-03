<div align="center">

# repo-health

**Instant health check for any git repository.**

[![npm version](https://img.shields.io/npm/v/repo-scanner?color=brightgreen&label=npm)](https://www.npmjs.com/package/repo-scanner)
[![license](https://img.shields.io/github/license/efegorkembildi12-lang/repo-scanner)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org)

Scans your repo and scores it across docs, security, quality, and structure.  
No sign-up. No network calls. No AI. Just your code.

```bash
npx repo-scanner .
```

</div>

---

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

  ──────────────────────────────────────────────────────────────
    Score   ████████████████░░░░░░░░   68/100   Fair
  ──────────────────────────────────────────────────────────────

  Suggestions:
    → Add a LICENSE file so others know how they can use your project
    → Add a CI workflow (e.g. GitHub Actions) to automate tests and builds
    → Remove secret files from git history and add them to .gitignore
```

---

## Why repo-health?

Most projects accumulate small gaps over time — a missing license here, a tracked `.env` there, no CI, no tests. None of these break the build, so they never get fixed. repo-health makes them visible with a single command.

---

## Install

No install required — use `npx` for a one-off scan:

```bash
npx repo-scanner .
```

Or install globally:

```bash
npm install -g repo-scanner
```

---

## Usage

```bash
repo-health .                          # scan current directory
repo-health /path/to/repo              # scan a specific path
repo-health . --json                   # machine-readable output
repo-health . --strict                 # WARNs count as zero (CI mode)
repo-health . --config rh.json         # custom rule weights
repo-health . --html report.html       # shareable HTML report
```

---

## What gets checked

10 checks across 4 categories. Each contributes to the 0–100 score.

| | Category | Check | Weight |
|---|---|---|:---:|
| ✓ | **Documentation** | README exists and is non-empty | 10 |
| ✓ | **Documentation** | LICENSE file present | 5 |
| ✓ | **Security** | No secret files tracked in git | 15 |
| ✓ | **Security** | .gitignore present | 10 |
| ✓ | **Quality** | Test script or test directory found | 10 |
| ✓ | **Quality** | Lint / format config found | 5 |
| ✓ | **Quality** | CI config found (GitHub Actions, GitLab CI…) | 10 |
| ✓ | **Structure** | Valid git repository | 15 |
| ✓ | **Structure** | Lockfile present | 10 |
| ✓ | **Structure** | No tracked files over 10 MB | 10 |

**Scoring:** `PASS = full points` · `WARN = half points` · `FAIL = zero`

---

## Config file

Override weights or disable checks with a `repo-health.json` file:

```json
{
  "rules": {
    "license": { "enabled": false },
    "ci":      { "weight": 15 },
    "secrets": { "weight": 20 }
  }
}
```

```bash
repo-health . --config repo-health.json
```

---

## Use as a CI gate

```yaml
# .github/workflows/health.yml
name: Repo Health
on: [push]

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check repo health
        run: npx repo-scanner . --strict
```

In `--strict` mode, WARNs are treated as failures — useful for enforcing standards on every push.

**Exit codes:** `0` = score ≥ 50 · `1` = score < 50 · `2` = error

---

## Philosophy

- **Free** — no accounts, no tokens, no telemetry
- **Local-first** — reads only your filesystem and git history
- **Fast** — typically completes in under a second
- **Honest** — gives you a real score, not just green checkmarks

---

## License

MIT © [Efe Görkem Bildi](https://github.com/efegorkembildi12-lang)
