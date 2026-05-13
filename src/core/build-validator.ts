import { z } from 'zod';
import type { Config, VarSpec } from './schema.js';

export function buildValidator(config: Config) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [name, spec] of Object.entries(config.vars)) {
    shape[name] = buildVarValidator(spec);
  }

  return z.object(shape);
}

function buildVarValidator(spec: VarSpec): z.ZodTypeAny {
  let validator: z.ZodTypeAny;

  switch (spec.type) {
    case 'string': {
      let s = z.string();
      if (spec.min !== undefined) s = s.min(spec.min);
      if (spec.max !== undefined) s = s.max(spec.max);
      if (spec.pattern !== undefined) s = s.regex(new RegExp(spec.pattern));
      validator = s;
      break;
    }

    case 'number': {
      let n = z.coerce.number();
      if (spec.min !== undefined) n = n.min(spec.min);
      if (spec.max !== undefined) n = n.max(spec.max);
      validator = n;
      break;
    }

    case 'boolean':
      validator = z.coerce.boolean();
      break;

    case 'url':
      validator = z.string().url();
      break;

    case 'enum':
      validator = z.enum(spec.values as [string, ...string[]]);
      break;
  }

  if (spec.default !== undefined) {
    validator = validator.default(spec.default);
  }

  if (spec.required !== true && spec.default === undefined) {
    validator = validator.optional();
  }

  return validator;
}