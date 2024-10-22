import { randomUUID } from 'crypto';

import { Player } from './player.entity';
import { Round } from './round.entity';
import { Scoreboard } from './scoreboard.entity';

type IGetChampionshipData = {
  id: string;
  name: string;
  createdBy: string;
  playersCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type ICreateChampionshipInput = {
  name: string;
  createdBy: string;
  players: Player[];
};

type IRestoreChampionshipInput = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  players: Player[];
  scoreboards: Scoreboard[];
  rounds: Round[];
  playersCount: number;
};

type IConstructorInput = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  players: Player[];
  scoreboards: Scoreboard[];
  rounds: Round[];
  playersCount: number;
};

export class Championship {
  private id: string;
  private name: string;
  private createdBy: string;
  private createdAt: Date;
  private updatedAt: Date;
  private players: Player[];
  private scoreboards: Scoreboard[];
  private rounds: Round[];
  private playersCount: number;

  private constructor(championship: IConstructorInput) {
    this.id = championship.id;
    this.name = championship.name;
    this.createdBy = championship.createdBy;
    this.createdAt = championship.createdAt;
    this.updatedAt = championship.updatedAt;
    this.playersCount = championship.playersCount;
    this.players = championship.players;
    this.scoreboards = championship.scoreboards;
    this.rounds = championship.rounds;
  }

  get getData(): IGetChampionshipData {
    const { id, name, createdBy, createdAt, updatedAt, playersCount } = this;

    return { id, name, createdBy, createdAt, updatedAt, playersCount };
  }

  get getPlayers(): Player[] {
    return this.players;
  }

  get getRounds(): Round[] {
    return this.rounds;
  }

  get getScoreboards(): Scoreboard[] {
    return this.scoreboards;
  }

  addRounds(rounds: Round[]): void {
    this.rounds = rounds;
  }

  calculateRankings(): void {
    this.scoreboards.sort((a, b) => {
      if (b.getData.score !== a.getData.score) {
        return b.getData.score - a.getData.score;
      }

      if (b.getData.goalDifference !== a.getData.goalDifference) {
        return b.getData.goalDifference - a.getData.goalDifference;
      }

      if (b.getData.wins !== a.getData.wins) {
        return b.getData.wins - a.getData.wins;
      }

      if (b.getData.draws !== a.getData.draws) {
        return b.getData.draws - a.getData.draws;
      }

      return a.getData.loses - b.getData.loses;
    });
  }

  static create(championship: ICreateChampionshipInput): Championship {
    if (championship.players.length < 2) {
      throw new Error('The championship must be have two or more players');
    }

    const championshipId = randomUUID();

    const scoreboards = championship.players.map(player =>
      Scoreboard.create({
        playerId: player.getData.id,
        playerName: player.getData.name,
        championshipId,
      }),
    );

    return new Championship({
      id: championshipId,
      name: championship.name,
      createdBy: championship.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      players: championship.players,
      scoreboards,
      rounds: [],
      playersCount: championship.players.length,
    });
  }

  static restore(championship: IRestoreChampionshipInput): Championship {
    return new Championship(championship);
  }
}
