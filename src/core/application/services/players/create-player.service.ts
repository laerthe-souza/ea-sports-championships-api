import { IAuthProvider } from '@core/application/providers/auth.provider';
import { Player } from '@core/domain/entities/player.entity';
import { IPlayersRepository } from '@core/domain/repositories/players.repository';
import { AuthProvider } from '@core/infra/providers/auth.provider';
import { PlayersRepository } from '@core/infra/repositories/players.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ICreatePlayerRequestDTO } from './dtos/create-player.dto';

type IResponse = {
  player: Player['getData'];
  token: string;
};

@Injectable()
export class CreatePlayerService {
  constructor(
    @Inject(PlayersRepository)
    private readonly playersRepository: IPlayersRepository,
    @Inject(AuthProvider) private readonly authProvider: IAuthProvider,
  ) {}

  async execute(data: ICreatePlayerRequestDTO): Promise<IResponse> {
    const player = Player.create(data);

    const playerAlreadyExists = await this.playersRepository.find({
      username: player.getData.username,
    });

    if (playerAlreadyExists) {
      throw new BadRequestException('This player username already exists');
    }

    await this.playersRepository.insert(player);

    const { id, name, username } = player.getData;

    const token = this.authProvider.generateToken({ id, name, username });

    return {
      player: player.getData,
      token,
    };
  }
}
