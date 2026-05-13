import { loadSchema } from '../core/load-schema.js';
import { loadEnv } from '../core/load-env.js';
import { buildValidator } from '../core/build-validator.js';
import { validateEnv } from '../core/validate-env.js';
import { renderHuman, renderJson } from '../core/reporter.js';

export async function validateAction(options: { schema: string; env: string; ci: boolean }): Promise<number> {
  const config = await loadSchema(options.schema);
  const env = await loadEnv(options.env);
  const validator = buildValidator(config);
  const result = validateEnv(validator, env);

  if (options.ci) {
    process.stdout.write(renderJson(result) + '\n');
  } else {
    const output = renderHuman(result, { color: true });
    if (result.ok) {
      process.stdout.write(output + '\n');
    } else {
      process.stderr.write(output + '\n');
    }
  }

  return result.ok ? 0 : 1;
}