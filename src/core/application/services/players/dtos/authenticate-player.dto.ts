import { z } from 'zod';

export const authenticatePlayerRequestDTO = z.object({
  username: z.string({ required_error: 'Username required' }),
  password: z.string({ required_error: 'Password required' }),
});

export type IAuthenticatePlayerRequestDTO = z.output<
  typeof authenticatePlayerRequestDTO
>;
