import { Request } from 'express';

import { CreateChampionshipRoundsService } from '@core/application/services/championships/create-championship-rounds.service';
import { CreateChampionshipService } from '@core/application/services/championships/create-championship.service';
import {
  createChampionshipRequestDTO,
  ICreateChampionshipRequestDTO,
} from '@core/application/services/championships/dtos/create-championship-request.dto';
import {
  finishChampionshipRoundRequestDTO,
  IFinishChampionshipRoundRequestDTO,
} from '@core/application/services/championships/dtos/finish-championship-round-request.dto';
import { FindChampionshipService } from '@core/application/services/championships/find-championship.service';
import { FindPlayerChampionshipsService } from '@core/application/services/championships/find-player-championships.service';
import { FinishChampionshipRoundService } from '@core/application/services/championships/finish-championship-round.service';
import { AuthGuard } from '@framework/infra/guards/auth.guard';
import { ZodValidationPipe } from '@framework/infra/validation-pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

@Controller('championships')
export class ChampionshipsController {
  constructor(
    private readonly createChampionship: CreateChampionshipService,
    private readonly findPlayerChampionships: FindPlayerChampionshipsService,
    private readonly findChampionship: FindChampionshipService,
    private readonly createChampionshipRounds: CreateChampionshipRoundsService,
    private readonly finishChampionshipRound: FinishChampionshipRoundService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createChampionshipRequestDTO))
  async create(
    @Body() data: ICreateChampionshipRequestDTO,
    @Req() request: Request,
  ) {
    const { username } = request.player;

    return this.createChampionship.execute({ ...data, createdBy: username });
  }

  @Post(':id/rounds/:roundId/finish')
  @UseGuards(AuthGuard)
  async finishRound(
    @Param('id') id: string,
    @Param('roundId') roundId: string,
    @Body(new ZodValidationPipe(finishChampionshipRoundRequestDTO))
    data: IFinishChampionshipRoundRequestDTO,
    @Req() request: Request,
  ) {
    return this.finishChampionshipRound.execute({
      id,
      roundId,
      requestedBy: request.player.id,
      ...data,
    });
  }

  @Post(':id/rounds')
  @UseGuards(AuthGuard)
  async createRounds(@Param('id') id: string, @Req() request: Request) {
    return this.createChampionshipRounds.execute({
      id,
      playerUsername: request.player.username,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async find(@Param('id') id: string, @Req() request: Request) {
    return this.findChampionship.execute({ id, playerId: request.player.id });
  }

  @Get()
  @UseGuards(AuthGuard)
  async findPlayer(@Req() request: Request) {
    const { id } = request.player;

    return this.findPlayerChampionships.execute({ playerId: id });
  }
}
