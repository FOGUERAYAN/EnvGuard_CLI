import fs from 'node:fs/promises';
import dotenv from 'dotenv';
import { IoError } from '../errors.js';

export async function loadEnv(path: string): Promise<Record<string, string>> {
  try {
    const buffer = await fs.readFile(path);
    return dotenv.parse(buffer);
  } catch {
    throw new IoError(`Impossible de lire le fichier env : ${path}`);
  }
}