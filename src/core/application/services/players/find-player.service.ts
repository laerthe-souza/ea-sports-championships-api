import { Player } from '@core/domain/entities/player.entity';
import { IPlayersRepository } from '@core/domain/repositories/players.repository';
import { PlayersRepository } from '@core/infra/repositories/players.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IFindPlayerRequestDTO } from './dtos/find-player.dto';

@Injectable()
export class FindPlayerService {
  constructor(
    @Inject(PlayersRepository)
    private readonly playersRepository: IPlayersRepository,
  ) {}

  async execute(data: IFindPlayerRequestDTO): Promise<Player['getData']> {
    const player = await this.playersRepository.find(data);

    if (!player) {
      throw new NotFoundException('This player not exists');
    }

    return player.getData;
  }
}
