import { renderJson, renderHuman } from '../../src/core/reporter.js';
import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

describe('reporter', () => {
  const mockIssues: z.ZodIssue[] = [
    {
      code: 'invalid_type',
      expected: 'number',
      received: 'string',
      path: ['PORT'],
      message: 'Expected number, received string',
    } as z.ZodIssue,
  ];

  it('renderJson devrait avoir une structure stable', () => {
    const output = renderJson({ ok: false, issues: mockIssues });
    expect(JSON.parse(output)).toMatchObject({
      success: false,
      errors: expect.any(Array),
    });
  });

  it('renderHuman devrait inclure le nom de la variable', () => {
    const output = renderHuman(
      { ok: false, issues: mockIssues },
      { color: false }
    );
    expect(output).toContain('PORT');
    expect(output).toContain('Expected number');
  });
});
