import chalk from 'chalk';
import { CheckCategory, CheckResult, CheckStatus, HealthReport } from '../types.js';

const CATEGORY_ORDER: CheckCategory[] = ['Documentation', 'Security', 'Quality', 'Structure'];

const STATUS_SYMBOL: Record<CheckStatus, string> = {
  PASS: '✓',
  WARN: '●',
  FAIL: '✗',
};

const STATUS_COLOR: Record<CheckStatus, (s: string) => string> = {
  PASS: chalk.green,
  WARN: chalk.yellow,
  FAIL: chalk.red,
};

function scoreColor(pct: number): (s: string) => string {
  if (pct >= 80) return chalk.green;
  if (pct >= 50) return chalk.yellow;
  return chalk.red;
}

function grade(pct: number): string {
  if (pct >= 90) return 'Excellent';
  if (pct >= 80) return 'Good';
  if (pct >= 50) return 'Fair';
  return 'Needs Work';
}

function scoreBar(pct: number, width = 24): string {
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;
  return chalk.green('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
}

function renderCheck(r: CheckResult): string {
  const symbol = STATUS_COLOR[r.status](STATUS_SYMBOL[r.status]);
  return `  ${symbol}  ${r.message}`;
}

function renderCategory(cat: CheckCategory, results: CheckResult[]): string | null {
  const items = results.filter((r) => r.category === cat);
  if (items.length === 0) return null;

  const header = chalk.dim.bold(`  ${cat.toUpperCase()}`);
  const rows = items.map(renderCheck).join('\n');
  return `${header}\n${rows}`;
}

function headerBox(repoPath: string): string {
  const label = `  repo-health  ${repoPath}`;
  // trim if too long for typical terminals
  const maxWidth = 60;
  const display = label.length > maxWidth ? label.slice(0, maxWidth - 1) + '…' : label;
  const inner = display.padEnd(maxWidth);
  const top = `╭${'─'.repeat(maxWidth + 2)}╮`;
  const mid = `│ ${inner} │`;
  const bot = `╰${'─'.repeat(maxWidth + 2)}╯`;
  return [chalk.dim(top), chalk.dim('│ ') + chalk.bold(display) + chalk.dim(' │'), chalk.dim(bot)].join('\n');
}

export function renderReport(report: HealthReport): string {
  const lines: string[] = [];
  const colorFn = scoreColor(report.percentage);

  lines.push('');
  lines.push(headerBox(report.repoPath));
  lines.push('');

  for (const cat of CATEGORY_ORDER) {
    const section = renderCategory(cat, report.results);
    if (section) {
      lines.push(section);
      lines.push('');
    }
  }

  const divider = chalk.dim('  ' + '─'.repeat(52));
  const bar = scoreBar(report.percentage);
  const pctLabel = colorFn(chalk.bold(`${report.percentage}/100`));
  const gradeLabel = colorFn(grade(report.percentage));

  lines.push(divider);
  lines.push(`    Score   ${bar}   ${pctLabel}   ${gradeLabel}`);
  lines.push(divider);

  if (report.suggestions.length > 0) {
    lines.push('');
    lines.push(chalk.dim.bold('  Suggestions:'));
    for (const s of report.suggestions) {
      lines.push(`    ${chalk.dim('→')} ${s}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
