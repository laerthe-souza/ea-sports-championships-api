import { randomUUID } from 'crypto';

import { IPlayerRoundStats } from './round.entity';

type IScoreboardDTO = {
  id: string;
  playerId: string;
  championshipId: string;
  score: number;
  playedRounds: number;
  playerName: string;
  wins: number;
  draws: number;
  loses: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  createdAt: Date;
  updatedAt: Date;
};

type IConstructorInput = {
  id: string;
  playerId: string;
  championshipId: string;
  score: number;
  playedRounds: number;
  playerName: string;
  wins: number;
  draws: number;
  loses: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  createdAt: Date;
  updatedAt: Date;
};

type IRestoreScoreboardInput = {
  id: string;
  playerId: string;
  championshipId: string;
  score: number;
  playedRounds: number;
  playerName: string;
  wins: number;
  draws: number;
  loses: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  createdAt: Date;
  updatedAt: Date;
};

type ICreateScoreboardInput = {
  playerId: string;
  playerName: string;
  championshipId: string;
};

export class Scoreboard {
  private id: string;
  private playerId: string;
  private playerName: string;
  private championshipId: string;
  private score: number;
  private playedRounds: number;
  private wins: number;
  private draws: number;
  private loses: number;
  private goalsScored: number;
  private goalsConceded: number;
  private goalDifference: number;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(scoreboard: IConstructorInput) {
    this.id = scoreboard.id;
    this.playerId = scoreboard.playerId;
    this.playerName = scoreboard.playerName;
    this.championshipId = scoreboard.championshipId;
    this.score = scoreboard.score;
    this.playedRounds = scoreboard.playedRounds;
    this.wins = scoreboard.wins;
    this.draws = scoreboard.draws;
    this.loses = scoreboard.loses;
    this.goalsScored = scoreboard.goalsScored;
    this.goalsConceded = scoreboard.goalsConceded;
    this.goalDifference = scoreboard.goalDifference;
    this.createdAt = scoreboard.createdAt;
    this.updatedAt = scoreboard.updatedAt;
  }

  get getData(): IScoreboardDTO {
    const {
      id,
      playerId,
      playerName,
      championshipId,
      score,
      playedRounds,
      wins,
      draws,
      loses,
      goalsScored,
      goalsConceded,
      goalDifference,
      createdAt,
      updatedAt,
    } = this;

    return {
      id,
      playerId,
      playerName,
      championshipId,
      score,
      playedRounds,
      wins,
      draws,
      loses,
      goalsScored,
      goalsConceded,
      goalDifference,
      createdAt,
      updatedAt,
    };
  }

  updateStats(stats: IPlayerRoundStats): void {
    const goalsDifference = stats.goalsScored - stats.goalsConceded;

    if (stats.win) {
      this.wins += 1;
      this.score += 3;
    }

    if (stats.draw) {
      this.draws += 1;
      this.score += 1;
    }

    this.loses += stats.lose ? 1 : 0;
    this.goalDifference += goalsDifference;
    this.goalsScored += stats.goalsScored;
    this.goalsConceded += stats.goalsConceded;
    this.playedRounds += 1;
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
      goalDifference: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...scoreboard,
    });
  }
}
