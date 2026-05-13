import { buildValidator } from '../../src/core/build-validator.js';
import { describe, it, expect } from '@jest/globals';

describe('buildValidator', () => {
  it('devrait convertir les chaînes en nombres (coercion)', () => {
    const config = {
      $version: "1" as const,
      vars: { PORT: { type: "number" as const } }
    };
    const validator = buildValidator(config);
    const result = validator.safeParse({ PORT: "8080" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8080); 
    }
  });

  it('devrait respecter les enums', () => {
    const config = {
      $version: "1" as const,
      vars: { MODE: { type: "enum" as const, values: ["prod", "dev"] } }
    };
    const validator = buildValidator(config);
    expect(validator.safeParse({ MODE: "prod" }).success).toBe(true);
    expect(validator.safeParse({ MODE: "invalid" }).success).toBe(false);
  });
});