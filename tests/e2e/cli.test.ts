import { describe, it, expect } from '@jest/globals';
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

const BIN_PATH = path.resolve(process.cwd(), 'dist/cli.js');

function execa(
  command: string,
  args: string[],
  options: { reject?: boolean; cwd?: string } = {}
) {
  return new Promise<{ exitCode: number; stdout: string; stderr: string }>(
    (resolve, reject) => {
      const child = spawn(command, args, { stdio: 'pipe', cwd: options.cwd });
      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        const result = { exitCode: code || 0, stdout, stderr };
        if (options.reject === false || code === 0) {
          resolve(result);
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on('error', reject);
    }
  );
}

describe('E2E: envguard CLI', () => {
  describe('validate', () => {
    it('devrait renvoyer 0 sur un environnement valide', async () => {
      const { exitCode, stdout } = await execa(
        'node',
        [
          BIN_PATH,
          'validate',
          '-s',
          'tests/e2e/fixtures/valid/envguard.schema.json',
          '-e',
          'tests/e2e/fixtures/valid/.env',
        ],
        { reject: false }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Validation réussie');
    });

    it('devrait renvoyer 1 sur une erreur de validation', async () => {
      const { exitCode, stderr } = await execa(
        'node',
        [
          BIN_PATH,
          'validate',
          '-s',
          'tests/e2e/fixtures/valid/envguard.schema.json',
          '-e',
          'tests/e2e/fixtures/invalid/.env',
        ],
        { reject: false }
      );

      expect(exitCode).toBe(1);
      expect(stderr).not.toBe('');
    });

    it('devrait produire du JSON en mode --ci', async () => {
      const { stdout } = await execa('node', [
        BIN_PATH,
        'validate',
        '--ci',
        '-s',
        'tests/e2e/fixtures/valid/envguard.schema.json',
        '-e',
        'tests/e2e/fixtures/valid/.env',
      ]);

      const json = JSON.parse(stdout);
      expect(json).toHaveProperty('success', true);
    });
  });

  describe('init & diff', () => {
    it('init ne devrait pas écraser sans --force', async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'envguard-e2e-'));
      try {
        await fs.writeFile(path.join(tmpDir, 'envguard.schema.json'), '{}');

        const { exitCode } = await execa('node', [BIN_PATH, 'init'], {
          reject: false,
          cwd: tmpDir,
        });
        expect(exitCode).toBe(1);
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it('diff devrait renvoyer 1 si les fichiers divergent', async () => {
      const { exitCode } = await execa(
        'node',
        [
          BIN_PATH,
          'diff',
          'tests/e2e/fixtures/valid/.env',
          'tests/e2e/fixtures/invalid/.env',
        ],
        { reject: false }
      );

      expect(exitCode).toBe(1);
    });
  });
});
