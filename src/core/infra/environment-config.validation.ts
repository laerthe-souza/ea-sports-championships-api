import { ZodError, z } from 'zod';

enum ZodErrors {
  required = 'Required variable',
  invalid_url = 'Invalid url',
}

const envVariablesSchema = z.object({
  NODE_ENV: z.enum(['local', 'stage', 'prod'], {
    required_error: ZodErrors.required,
  }),
  PORT: z.string({ required_error: ZodErrors.required }),
});

export function validateEnvVariables(
  config: Record<string, string | number | boolean>,
) {
  try {
    const parsedEnv = envVariablesSchema.parse(config);

    return parsedEnv;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(
        data => `Env variable ${data.path[0]} error - ${data.message}`,
      );

      throw new Error(`\n\n${formattedErrors.join('\n')}\n`);
    } else {
      throw new Error(error);
    }
  }
}

export type IMyAppEnvVariables = z.output<typeof envVariablesSchema>;
