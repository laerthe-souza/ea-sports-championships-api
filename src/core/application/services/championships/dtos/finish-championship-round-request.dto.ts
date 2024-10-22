import { z } from 'zod';

export const finishChampionshipRoundRequestDTO = z.object({
  playersRounds: z
    .object({
      id: z.string({ required_error: 'Player round id required' }),
      playerId: z.string({ required_error: 'Player id required' }),
      goals: z.number({ required_error: 'Player round goals required' }),
    })
    .array()
    .nonempty('Players ids required'),
});

export type IFinishChampionshipRoundRequestDTO = z.output<
  typeof finishChampionshipRoundRequestDTO
>;
