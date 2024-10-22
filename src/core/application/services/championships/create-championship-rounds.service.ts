import { PlayerRound } from '@core/domain/entities/player-round.entity';
import { Round } from '@core/domain/entities/round.entity';
import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { ChampionshipsRepository } from '@core/infra/repositories/championships.repository';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';

type IRequest = {
  id: string;
  playerUsername: string;
};

type IResponse = (Round['getData'] & {
  playersRounds: PlayerRound['getData'][];
})[];

@Injectable()
export class CreateChampionshipRoundsService {
  constructor(
    @Inject(ChampionshipsRepository)
    private readonly championshipRepository: IChampionshipsRepository,
  ) {}

  async execute({ id, playerUsername }: IRequest): Promise<IResponse> {
    const championship = await this.championshipRepository.findById(id);

    if (!championship) {
      throw new BadRequestException('This championship does not exists');
    }

    if (championship.getData.createdBy !== playerUsername) {
      throw new ForbiddenException(
        'You do not have permission to do this action',
      );
    }

    const generatedRounds = Round.generate(championship.getPlayers);

    const rounds = generatedRounds.map(round =>
      Round.create({
        championshipId: id,
        id: round.roundId,
        playersRounds: round.playersRounds,
      }),
    );

    championship.addRounds(rounds);

    await this.championshipRepository.save(championship);

    return rounds.map(round => ({
      ...round.getData,
      playersRounds: round.getPlayerRounds.map(
        playerRound => playerRound.getData,
      ),
    }));
  }
}
