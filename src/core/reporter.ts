// src/core/reporter.ts
import pc from 'picocolors';
import type { ValidationResult } from './validate-env.js';

export function renderHuman(
  result: ValidationResult,
  options: { color: boolean }
): string {
  if (result.ok) {
    return options.color
      ? pc.green('Validation réussie !')
      : 'Validation réussie !';
  }

  const lines: string[] = [];
  lines.push(
    options.color ? pc.red('Échec de validation :') : 'Échec de validation :'
  );

  const grouped = new Map<string, string[]>();
  for (const issue of result.issues) {
    const key = issue.path.join('.');
    const messages = grouped.get(key) || [];
    messages.push(issue.message);
    grouped.set(key, messages);
  }

  for (const [key, messages] of grouped) {
    const label = options.color ? pc.yellow(key) : key;
    lines.push(`  - ${label}: ${messages.join(', ')}`);
  }

  return lines.join('\n');
}

export function renderJson(result: ValidationResult): string {
  return JSON.stringify(
    {
      success: result.ok,
      timestamp: new Date().toISOString(),
      ...(result.ok ? { data: result.parsed } : { errors: result.issues }),
    },
    null,
    2
  );
}
