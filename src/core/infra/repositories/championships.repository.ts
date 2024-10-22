import { Championship } from '@core/domain/entities/championship.entity';
import { PlayerRound } from '@core/domain/entities/player-round.entity';
import { Player } from '@core/domain/entities/player.entity';
import { Round } from '@core/domain/entities/round.entity';
import { Scoreboard } from '@core/domain/entities/scoreboard.entity';
import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { PrismaProvider } from '@framework/infra/database/prisma/prisma.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChampionshipsRepository implements IChampionshipsRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async insert(championship: Championship): Promise<void> {
    const scoreboards = championship.getScoreboards.map(scoreboard => {
      return {
        id: scoreboard.getData.id,
        score: scoreboard.getData.score,
        wins: scoreboard.getData.wins,
        draws: scoreboard.getData.draws,
        loses: scoreboard.getData.loses,
        goalsScored: scoreboard.getData.goalsScored,
        playedRounds: scoreboard.getData.playedRounds,
        goalsConceded: scoreboard.getData.goalsConceded,
        goalDifference: scoreboard.getData.goalDifference,
        createdAt: scoreboard.getData.createdAt,
        updatedAt: scoreboard.getData.updatedAt,
        playerId: scoreboard.getData.playerId,
      };
    });

    await this.prisma.championship.create({
      data: {
        id: championship.getData.id,
        name: championship.getData.name,
        createdBy: championship.getData.createdBy,
        createdAt: championship.getData.createdAt,
        updatedAt: championship.getData.updatedAt,
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
        scoreboards: {
          include: {
            player: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async save(championship: Championship): Promise<void> {
    await this.prisma.championship.update({
      where: {
        id: championship.getData.id,
        updatedAt: championship.getData.updatedAt,
      },
      data: {
        scoreboards: {
          updateMany: championship.getScoreboards.map(scoreboard => ({
            where: {
              id: scoreboard.getData.id,
              updatedAt: scoreboard.getData.updatedAt,
            },
            data: {
              draws: scoreboard.getData.draws,
              goalsConceded: scoreboard.getData.goalsConceded,
              goalsScored: scoreboard.getData.goalsScored,
              loses: scoreboard.getData.loses,
              playedRounds: scoreboard.getData.playedRounds,
              goalDifference: scoreboard.getData.goalDifference,
              score: scoreboard.getData.score,
              wins: scoreboard.getData.wins,
            },
          })),
        },
        rounds: {
          upsert: championship.getRounds.map(round => ({
            create: {
              id: round.getData.id,
              hasPlayed: round.getData.hasPlayed,
              createdAt: round.getData.createdAt,
              updatedAt: round.getData.updatedAt,
              players: {
                createMany: {
                  data: round.getPlayerRounds.map(playerRound => ({
                    goals: playerRound.getData.goals,
                    isHome: playerRound.getData.isHome,
                    playerId: playerRound.getData.playerId,
                    createdAt: playerRound.getData.createdAt,
                    id: playerRound.getData.id,
                    updatedAt: playerRound.getData.updatedAt,
                  })),
                },
              },
            },
            where: { id: round.getData.id, updatedAt: round.getData.updatedAt },
            update: {
              hasPlayed: round.getData.hasPlayed,
              players: {
                updateMany: round.getPlayerRounds.map(playerRound => ({
                  where: {
                    id: playerRound.getData.id,
                    updatedAt: playerRound.getData.updatedAt,
                  },
                  data: {
                    goals: playerRound.getData.goals,
                    confirmed: playerRound.getData.confirmed,
                    isHome: playerRound.getData.isHome,
                  },
                })),
              },
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
        scoreboards: {
          include: {
            player: { select: { name: true } },
          },
        },
      },
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
        rounds: [],
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
        rounds: {
          include: {
            players: { include: { player: { select: { name: true } } } },
          },
        },
        scoreboards: {
          include: { player: { select: { name: true } } },
        },
      },
    });

    if (!championship) {
      return null;
    }

    const { players, scoreboards, rounds, ...rest } = championship;

    return Championship.restore({
      ...rest,
      playersCount: players.length,
      rounds: rounds.map(({ players: playersRounds, ...round }) =>
        Round.restore({
          playersRounds: playersRounds.map(playerRound =>
            PlayerRound.restore({
              ...playerRound,
              playerName: playerRound.player.name,
            }),
          ),
          ...round,
        }),
      ),
      players: players.map(player => Player.restore(player.player)),
      scoreboards: scoreboards.map(({ player, ...scoreboard }) =>
        Scoreboard.restore({ ...scoreboard, playerName: player.name }),
      ),
    });
  }
}
