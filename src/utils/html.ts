import { CheckCategory, CheckResult, CheckStatus, HealthReport } from '../types.js';

const CATEGORY_ORDER: CheckCategory[] = ['Documentation', 'Security', 'Quality', 'Structure'];

const STATUS_COLOR: Record<CheckStatus, string> = {
  PASS: '#22c55e',
  WARN: '#f59e0b',
  FAIL: '#ef4444',
};

const STATUS_BG: Record<CheckStatus, string> = {
  PASS: '#f0fdf4',
  WARN: '#fffbeb',
  FAIL: '#fef2f2',
};

const STATUS_ICON: Record<CheckStatus, string> = {
  PASS: '✓',
  WARN: '●',
  FAIL: '✗',
};

function scoreGrade(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: 'Excellent', color: '#16a34a' };
  if (pct >= 80) return { label: 'Good', color: '#22c55e' };
  if (pct >= 50) return { label: 'Fair', color: '#f59e0b' };
  return { label: 'Needs Work', color: '#ef4444' };
}

function renderCheckRow(r: CheckResult): string {
  return `
    <div class="check-row" style="border-left: 3px solid ${STATUS_COLOR[r.status]}; background: ${STATUS_BG[r.status]};">
      <span class="check-icon" style="color: ${STATUS_COLOR[r.status]};">${STATUS_ICON[r.status]}</span>
      <span class="check-message">${escHtml(r.message)}</span>
      <span class="check-badge" style="background: ${STATUS_COLOR[r.status]};">${r.status}</span>
    </div>`;
}

function renderCategory(category: CheckCategory, results: CheckResult[]): string {
  const inCategory = results.filter((r) => r.category === category);
  if (inCategory.length === 0) return '';

  return `
  <div class="category">
    <h3 class="category-title">${escHtml(category)}</h3>
    ${inCategory.map(renderCheckRow).join('')}
  </div>`;
}

function renderScoreBar(pct: number, color: string): string {
  return `
  <div class="score-bar-track">
    <div class="score-bar-fill" style="width: ${pct}%; background: ${color};"></div>
  </div>`;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHtml(report: HealthReport): string {
  const grade = scoreGrade(report.percentage);
  const generatedAt = new Date().toLocaleString();

  const categorySections = CATEGORY_ORDER.map((cat) =>
    renderCategory(cat, report.results)
  ).join('');

  const suggestionItems =
    report.suggestions.length > 0
      ? report.suggestions.map((s) => `<li>${escHtml(s)}</li>`).join('')
      : '<li style="color:#6b7280">No suggestions — looking good!</li>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>repo-health — ${escHtml(report.repoPath)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      min-height: 100vh;
      padding: 2rem 1rem;
    }
    .container { max-width: 740px; margin: 0 auto; }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .logo {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .logo span { color: #6366f1; }
    .repo-path {
      font-size: 0.78rem;
      color: #64748b;
      font-family: 'SF Mono', 'Fira Code', monospace;
      word-break: break-all;
      margin-bottom: 1.5rem;
    }

    /* Score card */
    .score-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .score-circle {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 5px solid ${grade.color};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .score-number {
      font-size: 1.6rem;
      font-weight: 800;
      color: ${grade.color};
      line-height: 1;
    }
    .score-denom { font-size: 0.7rem; color: #94a3b8; }
    .score-info { flex: 1; }
    .score-grade {
      font-size: 1.1rem;
      font-weight: 700;
      color: ${grade.color};
      margin-bottom: 0.5rem;
    }
    .score-bar-track {
      height: 8px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 0.4rem;
    }
    .score-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.3s ease;
    }
    .score-meta { font-size: 0.75rem; color: #94a3b8; }

    /* Categories */
    .category { margin-bottom: 1.25rem; }
    .category-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .check-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.875rem;
      border-radius: 8px;
      margin-bottom: 0.35rem;
    }
    .check-icon { font-size: 1rem; flex-shrink: 0; font-weight: 700; }
    .check-message { flex: 1; font-size: 0.85rem; color: #334155; }
    .check-badge {
      font-size: 0.65rem;
      font-weight: 700;
      color: #fff;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    /* Suggestions */
    .suggestions {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .suggestions h3 {
      font-size: 0.85rem;
      font-weight: 700;
      color: #475569;
      margin-bottom: 0.75rem;
    }
    .suggestions ul { list-style: none; }
    .suggestions li {
      font-size: 0.83rem;
      color: #475569;
      padding: 0.3rem 0;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      gap: 0.5rem;
    }
    .suggestions li::before { content: '→'; color: #a5b4fc; flex-shrink: 0; }
    .suggestions li:last-child { border-bottom: none; }

    /* Footer */
    .footer { font-size: 0.72rem; color: #94a3b8; text-align: center; padding-top: 0.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">repo<span>-health</span></div>
    </div>
    <div class="repo-path">${escHtml(report.repoPath)}</div>

    <div class="score-card">
      <div class="score-circle">
        <div class="score-number">${report.percentage}</div>
        <div class="score-denom">/100</div>
      </div>
      <div class="score-info">
        <div class="score-grade">${grade.label}</div>
        ${renderScoreBar(report.percentage, grade.color)}
        <div class="score-meta">${report.score} / ${report.maxScore} points earned</div>
      </div>
    </div>

    ${categorySections}

    <div class="suggestions">
      <h3>Suggestions</h3>
      <ul>${suggestionItems}</ul>
    </div>

    <div class="footer">Generated by repo-health · ${escHtml(generatedAt)}</div>
  </div>
</body>
</html>`;
}
