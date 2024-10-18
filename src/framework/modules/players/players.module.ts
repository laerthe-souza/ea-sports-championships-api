import { AuthenticatePlayerService } from '@core/application/services/players/authenticate-player.service';
import { CreatePlayerService } from '@core/application/services/players/create-player.service';
import { FindPlayerService } from '@core/application/services/players/find-player.service';
import { Module } from '@nestjs/common';

import { PlayersController } from './players.controller';

@Module({
  controllers: [PlayersController],
  providers: [
    CreatePlayerService,
    AuthenticatePlayerService,
    FindPlayerService,
  ],
})
export class PlayersModule {}
