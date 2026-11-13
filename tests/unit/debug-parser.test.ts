import { validateEnv } from '../../src/core/validate-env.js';
import { buildValidator } from '../../src/core/build-validator.js';
import { describe, it, expect } from '@jest/globals';

describe('DEBUG environment variable parsing', () => {
  const debugConfig = {
    $version: '1' as const,
    vars: {
      DEBUG: { type: 'boolean' as const, required: true },
    },
  };
  const validator = buildValidator(debugConfig);

  it('DEBUG=false → should parse as false', () => {
    const result = validateEnv(validator, { DEBUG: 'false' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parsed.DEBUG).toBe(false);
    }
  });

  it('DEBUG=true → should parse as true', () => {
    const result = validateEnv(validator, { DEBUG: 'true' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parsed.DEBUG).toBe(true);
    }
  });

  it('DEBUG=banane → should reject with error', () => {
    const result = validateEnv(validator, { DEBUG: 'banane' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].path).toContain('DEBUG');
    }
  });
});
