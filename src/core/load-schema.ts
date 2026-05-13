// src/core/load-schema.ts
import fs from 'node:fs/promises';
import { ConfigSchema, type Config } from './schema.js';
import { ConfigError, IoError } from '../errors.js';

export async function loadSchema(path: string): Promise<Config> {
  let content: string;
  
  try {
    content = await fs.readFile(path, 'utf-8');
  } catch {
    throw new IoError(`Impossible de lire le schéma : ${path}`);
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    throw new ConfigError(`Le fichier de schéma n'est pas un JSON valide : ${path}`);
  }

  const result = ConfigSchema.safeParse(json);
  if (!result.success) {
    const details = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new ConfigError(`Schéma invalide : ${details}`);
  }

  return result.data;
}