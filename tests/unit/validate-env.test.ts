import { validateEnv } from '../../src/core/validate-env.js';
import { buildValidator } from '../../src/core/build-validator.js';
import { describe, it, expect } from '@jest/globals';

describe('validateEnv', () => {
  const mockConfig = {
    $version: '1' as const,
    vars: {
      PORT: { type: 'number' as const, required: true },
      NODE_ENV: {
        type: 'enum' as const,
        values: ['dev', 'prod'],
        required: true,
      },
      DEBUG: { type: 'boolean' as const, default: false },
    },
  };
  const validator = buildValidator(mockConfig);

  it('devrait valider un environnement parfait (Happy Path)', () => {
    const env = {
      PORT: '3000',
      NODE_ENV: 'dev',
    };

    const result = validateEnv(validator, env);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parsed.PORT).toBe(3000);
      expect(result.parsed.DEBUG).toBe(false);
    }
  });

  it('devrait échouer si une variable requise est manquante', () => {
    const env = { PORT: '3000' };

    const result = validateEnv(validator, env);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].path).toContain('NODE_ENV');
    }
  });

  it('devrait collecter plusieurs erreurs en même temps (No short-circuit)', () => {
    const env = {
      PORT: 'pas-un-nombre',
      NODE_ENV: 'invalid-choice',
    };

    const result = validateEnv(validator, env);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      const errorPaths = result.issues.map((i) => i.path[0]);
      expect(errorPaths).toContain('PORT');
      expect(errorPaths).toContain('NODE_ENV');
      expect(result.issues.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('devrait valider correctement les types spécifiques (URL)', () => {
    const urlConfig = {
      $version: '1' as const,
      vars: { DB_URL: { type: 'url' as const } },
    };
    const urlValidator = buildValidator(urlConfig);

    expect(validateEnv(urlValidator, { DB_URL: 'https://google.com' }).ok).toBe(
      true
    );
    expect(validateEnv(urlValidator, { DB_URL: 'pas-une-url' }).ok).toBe(false);
  });
});
