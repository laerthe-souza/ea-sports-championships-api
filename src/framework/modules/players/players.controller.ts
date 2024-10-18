import { Request } from 'express';

import { AuthenticatePlayerService } from '@core/application/services/players/authenticate-player.service';
import { CreatePlayerService } from '@core/application/services/players/create-player.service';
import {
  authenticatePlayerRequestDTO,
  IAuthenticatePlayerRequestDTO,
} from '@core/application/services/players/dtos/authenticate-player.dto';
import {
  createPlayerRequestDTO,
  ICreatePlayerRequestDTO,
} from '@core/application/services/players/dtos/create-player.dto';
import { FindPlayerService } from '@core/application/services/players/find-player.service';
import { AuthGuard } from '@framework/infra/guards/auth.guard';
import { ZodValidationPipe } from '@framework/infra/validation-pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly createPlayer: CreatePlayerService,
    private readonly authenticatePlayer: AuthenticatePlayerService,
    private readonly findPlayer: FindPlayerService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createPlayerRequestDTO))
  async create(@Body() data: ICreatePlayerRequestDTO) {
    return this.createPlayer.execute(data);
  }

  @Post('authenticate')
  @UsePipes(new ZodValidationPipe(authenticatePlayerRequestDTO))
  async authenticate(@Body() data: IAuthenticatePlayerRequestDTO) {
    return this.authenticatePlayer.execute(data);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async find(@Req() request: Request) {
    const { id } = request.user;

    return this.findPlayer.execute({ id });
  }
}
