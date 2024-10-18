import { z } from 'zod';

export const createPlayerRequestDTO = z.object({
  name: z.string({ required_error: 'Name required' }),
  username: z.string({ required_error: 'Username required' }),
  password: z.string({ required_error: 'Password required' }),
  confirmPassword: z.string({ required_error: 'Confirm password required' }),
});

export type ICreatePlayerRequestDTO = z.output<typeof createPlayerRequestDTO>;
