// tests/unit/load-schema.test.ts
import { fs, vol } from 'memfs';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { loadSchema } from '../../src/core/load-schema.js';
import { ConfigError, IoError } from '../../src/errors.js';

jest.mock('node:fs/promises', () => fs.promises);

describe('loadSchema', () => {
  beforeEach(() => vol.reset());

  it('devrait charger un schéma valide', async () => {
    const validSchema = { $version: '1', vars: { PORT: { type: 'number' } } };
    vol.writeFileSync('/schema.json', JSON.stringify(validSchema));

    const config = await loadSchema('/schema.json');
    expect(config.$version).toBe('1');
  });

  it("devrait jeter IoError si le fichier n'existe pas", async () => {
    await expect(loadSchema('/void.json')).rejects.toThrow(IoError);
  });

  it('devrait jeter ConfigError si le nom de variable est invalide', async () => {
    const badSchema = {
      $version: '1',
      vars: { petit_port: { type: 'number' } },
    };
    vol.writeFileSync('/bad.json', JSON.stringify(badSchema));

    await expect(loadSchema('/bad.json')).rejects.toThrow(ConfigError);
  });
});
