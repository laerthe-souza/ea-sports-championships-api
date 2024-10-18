import { Championship } from '@core/domain/entities/championship.entity';
import { Player } from '@core/domain/entities/player.entity';
import { Scoreboard } from '@core/domain/entities/scoreboard.entity';
import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { PrismaProvider } from '@framework/infra/database/prisma/prisma.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChampionshipsRepository implements IChampionshipsRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async insert(championship: Championship): Promise<Championship> {
    const scoreboards = championship.getScoreboards.map(scoreboard => {
      const { championshipId: _, ...rest } = scoreboard.getData;

      return rest;
    });

    const createdChampionship = await this.prisma.championship.create({
      data: {
        ...championship.getData,
        players: {
          createMany: {
            data: championship.getPlayers.map(player => ({
              playerId: player.getData.id,
            })),
          },
        },
        scoreboards: {
          createMany: {
            data: scoreboards,
          },
        },
      },
      include: {
        players: {
          select: {
            player: true,
          },
        },
        scoreboards: true,
      },
    });

    const {
      players: championshipPlayers,
      scoreboards: championshipScoreboards,
      ...rest
    } = createdChampionship;

    return Championship.restore({
      ...rest,
      playersCount: championshipPlayers.length,
      players: championshipPlayers.map(player => Player.restore(player.player)),
      scoreboards: championshipScoreboards.map(scoreboard =>
        Scoreboard.restore(scoreboard),
      ),
    });
  }

  async save(championship: Championship): Promise<Championship> {
    const updatedChampionship = await this.prisma.championship.update({
      where: {
        id: championship.getData.id,
      },
      data: {
        ...championship.getData,
        scoreboards: {
          updateMany: championship.getScoreboards.map(scoreboard => ({
            data: scoreboard.getData,
            where: {
              id: scoreboard.getData.id,
            },
          })),
        },
      },
      include: {
        players: {
          select: {
            player: true,
          },
        },
        scoreboards: true,
      },
    });

    const {
      players: championshipPlayers,
      scoreboards: championshipScoreboards,
      ...rest
    } = updatedChampionship;

    return Championship.restore({
      ...rest,
      playersCount: championshipPlayers.length,
      players: championshipPlayers.map(player => Player.restore(player.player)),
      scoreboards: championshipScoreboards.map(scoreboard =>
        Scoreboard.restore(scoreboard),
      ),
    });
  }

  async findByPlayerId(playerId: string): Promise<Championship[]> {
    const championships = await this.prisma.playerChampionship.findMany({
      where: {
        playerId,
      },
      select: {
        championship: {
          include: {
            _count: { select: { players: true } },
          },
        },
      },
    });

    return championships.map(({ championship: { _count, ...championship } }) =>
      Championship.restore({
        ...championship,
        playersCount: _count.players,
        players: [],
        scoreboards: [],
      }),
    );
  }

  async findById(id: string): Promise<Championship | null> {
    const championship = await this.prisma.championship.findUnique({
      where: { id },
      include: {
        players: {
          select: {
            player: true,
          },
        },
        scoreboards: true,
      },
    });

    if (!championship) {
      return null;
    }

    const {
      players: championshipPlayers,
      scoreboards: championshipScoreboards,
      ...rest
    } = championship;

    return Championship.restore({
      ...rest,
      playersCount: championshipPlayers.length,
      players: championshipPlayers.map(player => Player.restore(player.player)),
      scoreboards: championshipScoreboards.map(scoreboard =>
        Scoreboard.restore(scoreboard),
      ),
    });
  }
}
