import { IAuthProvider } from '@core/application/providers/auth.provider';
import { Player } from '@core/domain/entities/player.entity';
import { IPlayersRepository } from '@core/domain/entities/repositories/players.repository';
import { AuthProvider } from '@core/infra/providers/auth.provider';
import { PlayersRepository } from '@core/infra/repositories/players.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { IAuthenticatePlayerRequestDTO } from './dtos/authenticate-player.dto';

type IResponse = {
  player: Player['getData'];
  token: string;
};

@Injectable()
export class AuthenticatePlayerService {
  constructor(
    @Inject(PlayersRepository)
    private readonly playersRepository: IPlayersRepository,
    @Inject(AuthProvider) private readonly authProvider: IAuthProvider,
  ) {}

  async execute(data: IAuthenticatePlayerRequestDTO): Promise<IResponse> {
    const player = await this.playersRepository.find({
      username: data.username,
    });

    if (!player) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!player.getPassword.compare(data.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, name, username } = player.getData;

    const token = this.authProvider.generateToken({ id, name, username });

    return {
      player: player.getData,
      token,
    };
  }
}
