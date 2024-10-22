import { Championship } from '@core/domain/entities/championship.entity';
import { Player } from '@core/domain/entities/player.entity';
import { Scoreboard } from '@core/domain/entities/scoreboard.entity';
import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { IPlayersRepository } from '@core/domain/repositories/players.repository';
import { ChampionshipsRepository } from '@core/infra/repositories/championships.repository';
import { PlayersRepository } from '@core/infra/repositories/players.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ICreateChampionshipRequestDTO } from './dtos/create-championship-request.dto';

type IResponse = Championship['getData'] & {
  players: Player['getData'][];
  scoreboards: Scoreboard['getData'][];
};

type IRequest = ICreateChampionshipRequestDTO & {
  createdBy: string;
};

@Injectable()
export class CreateChampionshipService {
  constructor(
    @Inject(ChampionshipsRepository)
    private readonly championshipRepository: IChampionshipsRepository,
    @Inject(PlayersRepository)
    private readonly playersRepository: IPlayersRepository,
  ) {}

  async execute(data: IRequest): Promise<IResponse> {
    if (data.players.includes(data.createdBy)) {
      throw new BadRequestException('You cannot add yourself in players list');
    }

    const participants = [...data.players, data.createdBy];

    const players = await this.playersRepository.findMany({
      usernames: participants,
    });

    if (players.length !== participants.length) {
      throw new NotFoundException('One of the players cannot be found');
    }

    const championship = Championship.create({
      name: data.name,
      createdBy: data.createdBy,
      players,
    });

    await this.championshipRepository.insert(championship);

    return {
      ...championship.getData,
      players: championship.getPlayers.map(player => player.getData),
      scoreboards: championship.getScoreboards.map(
        scoreboard => scoreboard.getData,
      ),
    };
  }
}
