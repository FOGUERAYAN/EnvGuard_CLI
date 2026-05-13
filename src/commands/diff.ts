import { loadEnv } from '../core/load-env.js';
import pc from 'picocolors';

export async function diffAction(fileA: string, fileB: string): Promise<number> {
  const envA = await loadEnv(fileA);
  const envB = await loadEnv(fileB);

  const keysA = Object.keys(envA);
  const keysB = Object.keys(envB);

  const onlyInA = keysA.filter(k => !keysB.includes(k));
  const onlyInB = keysB.filter(k => !keysA.includes(k));

  if (onlyInA.length === 0 && onlyInB.length === 0) {
    process.stdout.write(pc.green('Les fichiers ont des clés identiques.\n'));
    return 0;
  }

  if (onlyInA.length > 0) {
    process.stderr.write(pc.yellow(`Uniquement dans ${fileA}:\n`) + onlyInA.map(k => `  - ${k}`).join('\n') + '\n');
  }
  if (onlyInB.length > 0) {
    process.stderr.write(pc.yellow(`Uniquement dans ${fileB}:\n`) + onlyInB.map(k => `  - ${k}`).join('\n') + '\n');
  }

  return 1;
}