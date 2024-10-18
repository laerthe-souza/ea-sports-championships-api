import { randomUUID } from 'crypto';

type IScoreboardDTO = {
  id: string;
  playerId: string;
  championshipId: string;
  score: number;
  playedRounds: number;
  wins: number;
  draws: number;
  loses: number;
  goalsScored: number;
  goalsConceded: number;
  createdAt: Date;
  updatedAt: Date;
};

type IConstructorInput = {
  id: string;
  playerId: string;
  championshipId: string;
  score: number;
  playedRounds: number;
  wins: number;
  draws: number;
  loses: number;
  goalsScored: number;
  goalsConceded: number;
  createdAt: Date;
  updatedAt: Date;
};

type IRestoreScoreboardInput = {
  id: string;
  playerId: string;
  championshipId: string;
  score: number;
  playedRounds: number;
  wins: number;
  draws: number;
  loses: number;
  goalsScored: number;
  goalsConceded: number;
  createdAt: Date;
  updatedAt: Date;
};

type ICreateScoreboardInput = {
  playerId: string;
  championshipId: string;
};

export class Scoreboard {
  private id: string;
  private playerId: string;
  private championshipId: string;
  private score: number;
  private playedRounds: number;
  private wins: number;
  private draws: number;
  private loses: number;
  private goalsScored: number;
  private goalsConceded: number;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(scoreboard: IConstructorInput) {
    this.id = scoreboard.id;
    this.playerId = scoreboard.playerId;
    this.championshipId = scoreboard.championshipId;
    this.score = scoreboard.score;
    this.playedRounds = scoreboard.playedRounds;
    this.wins = scoreboard.wins;
    this.draws = scoreboard.draws;
    this.loses = scoreboard.loses;
    this.goalsScored = scoreboard.goalsScored;
    this.goalsConceded = scoreboard.goalsConceded;
    this.createdAt = scoreboard.createdAt;
    this.updatedAt = scoreboard.updatedAt;
  }

  get getData(): IScoreboardDTO {
    const {
      id,
      playerId,
      championshipId,
      score,
      playedRounds,
      wins,
      draws,
      loses,
      goalsScored,
      goalsConceded,
      createdAt,
      updatedAt,
    } = this;

    return {
      id,
      playerId,
      championshipId,
      score,
      playedRounds,
      wins,
      draws,
      loses,
      goalsScored,
      goalsConceded,
      createdAt,
      updatedAt,
    };
  }

  static restore(scoreboard: IRestoreScoreboardInput): Scoreboard {
    return new Scoreboard(scoreboard);
  }

  static create(scoreboard: ICreateScoreboardInput): Scoreboard {
    return new Scoreboard({
      id: randomUUID(),
      playedRounds: 0,
      score: 0,
      wins: 0,
      draws: 0,
      loses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...scoreboard,
    });
  }
}
