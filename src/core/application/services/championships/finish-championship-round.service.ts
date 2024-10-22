import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { ChampionshipsRepository } from '@core/infra/repositories/championships.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IFinishChampionshipRoundRequestDTO } from './dtos/finish-championship-round-request.dto';

type IRequest = IFinishChampionshipRoundRequestDTO & {
  id: string;
  roundId: string;
  requestedBy: string;
};

@Injectable()
export class FinishChampionshipRoundService {
  constructor(
    @Inject(ChampionshipsRepository)
    private readonly championshipRepository: IChampionshipsRepository,
  ) {}

  async execute(data: IRequest): Promise<void> {
    const championship = await this.championshipRepository.findById(data.id);

    if (!championship) {
      throw new NotFoundException('This championship does not exists');
    }

    const round = championship.getRounds.find(
      ({ getData }) => getData.id === data.roundId,
    );

    if (!round) {
      throw new NotFoundException('This round does not exists');
    }

    round.finish({
      requestedBy: data.requestedBy,
      playersRounds: data.playersRounds,
    });

    if (round.getData.hasPlayed) {
      const playersRoundsStats = round.calculateStats();

      playersRoundsStats.forEach(stat => {
        const scoreboard = championship.getScoreboards.find(
          ({ getData }) => getData.playerId === stat.playerId,
        );

        if (!scoreboard) {
          throw new BadRequestException(
            'Error when update scoreboard with player round stats',
          );
        }

        scoreboard.updateStats(stat);
      });
    }

    await this.championshipRepository.save(championship);
  }
}
