import { z } from 'zod';

export const createChampionshipRequestDTO = z.object({
  name: z.string({ required_error: 'Name required' }),
  players: z.array(z.string()).nonempty('Players ids required'),
});

export type ICreateChampionshipRequestDTO = z.output<
  typeof createChampionshipRequestDTO
>;
