#!/usr/bin/env node
import { Command } from 'commander';
import { analyzeRepo } from './index.js';
import { renderReport } from './utils/format.js';

const program = new Command();

program
  .name('repo-health')
  .description('Fast, local git repo health scanner')
  .version('0.1.0')
  .argument('[path]', 'Path to the repository', '.')
  .option('--json', 'Output results as JSON')
  .option('--strict', 'Treat WARN as FAIL (zero points)')
  .option('--config <file>', 'Path to a repo-health.json config file')
  .option('--html <file>', 'Write an HTML report to this file')
  .action(
    async (
      repoPath: string,
      options: { json?: boolean; strict?: boolean; config?: string; html?: string }
    ) => {
      try {
        const report = await analyzeRepo(repoPath, {
          strict: options.strict,
          configPath: options.config,
          htmlOutput: options.html,
        });

        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          console.log(renderReport(report));
          if (options.html) {
            console.log(`  HTML report written to: ${options.html}\n`);
          }
        }

        process.exit(report.percentage < 50 ? 1 : 0);
      } catch (err) {
        console.error('Error:', err instanceof Error ? err.message : String(err));
        process.exit(2);
      }
    }
  );

program.parse();
