import { z } from 'zod';

export type ValidationResult<T = Record<string, unknown>> =
  | { ok: true; parsed: T }
  | { ok: false; issues: z.ZodIssue[] };

export function validateEnv<T = Record<string, unknown>>(
  validator: z.ZodObject<Record<string, z.ZodTypeAny>>,
  env: Record<string, string>
): ValidationResult<T> {
  const result = validator.safeParse(env);

  if (result.success) {
    return { ok: true, parsed: result.data as T };
  }

  return { ok: false, issues: result.error.issues };
}
