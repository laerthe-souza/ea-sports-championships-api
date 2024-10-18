import { Championship } from '@core/domain/entities/championship.entity';
import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { ChampionshipsRepository } from '@core/infra/repositories/championships.repository';
import { Inject, Injectable } from '@nestjs/common';

type IResponse = Championship['getData'][];

type IRequest = {
  playerId: string;
};

@Injectable()
export class FindPlayerChampionshipsService {
  constructor(
    @Inject(ChampionshipsRepository)
    private readonly championshipsRepository: IChampionshipsRepository,
  ) {}

  async execute(data: IRequest): Promise<IResponse> {
    const championships = await this.championshipsRepository.findByPlayerId(
      data.playerId,
    );

    return championships.map(championship => championship.getData);
  }
}
