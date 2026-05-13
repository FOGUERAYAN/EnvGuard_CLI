import {z} from 'zod';

const BaseSpec = z.object({
  required: z.boolean().optional(),
});

const VarSpecSchema = z.discriminatedUnion('type', [
  BaseSpec.extend({ type: z.literal('string'), default: z.string().optional(), min: z.number().optional(), max: z.number().optional(), pattern: z.string().optional() }),
  BaseSpec.extend({ type: z.literal('number'), default: z.number().optional(), min: z.number().optional(), max: z.number().optional() }),
  BaseSpec.extend({ type: z.literal('boolean'), default: z.boolean().optional() }),
  BaseSpec.extend({ type: z.literal('url'), default: z.string().url().optional() }),
  BaseSpec.extend({ type: z.literal('enum'), values: z.array(z.string()), default: z.string().optional() }),
]); 

export const ConfigSchema = z.object ({
    $version: z.literal('1'),
    vars: z.record(
        z.string().regex(/^[A-Z][A-Z0-9_]*$/),
        VarSpecSchema
    ),
});

export type Config = z.infer<typeof ConfigSchema>;
export type VarSpec = z.infer<typeof VarSpecSchema>;