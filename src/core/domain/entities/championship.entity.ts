import { randomUUID } from 'crypto';

import { Player } from './player.entity';
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
  }

  get getData(): IGetChampionshipData {
    const { id, name, createdBy, createdAt, updatedAt, playersCount } = this;

    return { id, name, createdBy, createdAt, updatedAt, playersCount };
  }

  get getPlayers(): Player[] {
    return this.players;
  }

  get getScoreboards(): Scoreboard[] {
    return this.scoreboards;
  }

  static create(championship: ICreateChampionshipInput): Championship {
    const championshipId = randomUUID();

    const scoreboards = championship.players.map(player =>
      Scoreboard.create({ playerId: player.getData.id, championshipId }),
    );

    return new Championship({
      id: championshipId,
      name: championship.name,
      createdBy: championship.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      players: championship.players,
      scoreboards,
      playersCount: championship.players.length,
    });
  }

  static restore(championship: IRestoreChampionshipInput): Championship {
    return new Championship(championship);
  }
}
