import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';

const STARTER_SCHEMA = {
  $version: "1",
  vars: {
    PORT: { type: "number", default: 3000 },
    NODE_ENV: { type: "enum", values: ["development", "production", "test"], required: true }
  }
};

export async function initAction(options: { force: boolean }): Promise<number> {
  const target = path.join(process.cwd(), 'envguard.schema.json');
  
  const exists = await fs.access(target).then(() => true).catch(() => false);
  if (exists && !options.force) {
    process.stderr.write(pc.red('Le fichier existe déjà. Utilisez --force pour l\'écraser.\n'));
    return 1;
  }

  await fs.writeFile(target, JSON.stringify(STARTER_SCHEMA, null, 2));
  process.stdout.write(pc.green(`Schéma créé avec succès : ${target}\n`));
  return 0;
}