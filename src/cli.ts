import { Command } from 'commander';
import pc from 'picocolors';
import { validateAction } from './commands/validate.js';
import { diffAction } from './commands/diff.js';
import { initAction } from './commands/init.js';
import { mapErrorToExitCode } from './errors.js';

async function main() {
  const program = new Command();

  program
    .name('envguard')
    .description('CLI tool for environment variable validation')
    .version('1.0.0');

  program
    .command('validate')
    .option('-s, --schema <path>', 'Chemin du schéma', 'envguard.schema.json')
    .option('-e, --env <path>', 'Chemin du fichier .env', '.env')
    .option('--ci', 'Mode CI (Sortie JSON)', false)
    .action(async (options) => {
      process.exit(await validateAction(options));
    });

  program
    .command('diff <file-a> <file-b>')
    .action(async (a, b) => {
      process.exit(await diffAction(a, b));
    });

  program
    .command('init')
    .option('-f, --force', 'Force l\'écrasement', false)
    .action(async (options) => {
      process.exit(await initAction(options));
    });

  
  process.on('SIGINT', () => process.exit(130));
  process.on('SIGTERM', () => process.exit(143));

  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    const code = mapErrorToExitCode(err);
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(pc.red(`💥 Erreur : ${message}\n`));
    process.exit(code);
  }
}

main();