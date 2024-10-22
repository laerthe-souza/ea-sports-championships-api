import { randomUUID } from 'crypto';

type IPlayerRoundDTO = {
  id: string;
  roundId: string;
  playerId: string;
  playerName: string;
  goals: number;
  isHome: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type IConstructorInput = {
  id: string;
  roundId: string;
  playerId: string;
  playerName: string;
  goals: number;
  isHome: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ICreatePlayerRoundInput = {
  isHome: boolean;
  playerId: string;
  playerName: string;
  roundId: string;
};

type IRestorePlayerRoundInput = {
  id: string;
  roundId: string;
  playerId: string;
  playerName: string;
  goals: number;
  isHome: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class PlayerRound {
  private id: string;
  private roundId: string;
  private playerId: string;
  private playerName: string;
  private goals: number;
  private isHome: boolean;
  private confirmed: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(playerRound: IConstructorInput) {
    this.id = playerRound.id;
    this.roundId = playerRound.roundId;
    this.playerId = playerRound.playerId;
    this.playerName = playerRound.playerName;
    this.goals = playerRound.goals;
    this.isHome = playerRound.isHome;
    this.confirmed = playerRound.confirmed;
    this.createdAt = playerRound.createdAt;
    this.updatedAt = playerRound.updatedAt;
  }

  get getData(): IPlayerRoundDTO {
    const {
      createdAt,
      goals,
      id,
      isHome,
      confirmed,
      playerId,
      playerName,
      roundId,
      updatedAt,
    } = this;

    return {
      createdAt,
      goals,
      id,
      isHome,
      confirmed,
      playerId,
      playerName,
      roundId,
      updatedAt,
    };
  }

  confirm(): void {
    this.confirmed = true;
  }

  reopen(): void {
    this.confirmed = false;
  }

  addGoals(goals: number): void {
    if (goals < 0) {
      throw new Error('Goals cannot be negative');
    }

    this.goals = goals;
  }

  static create(playerRound: ICreatePlayerRoundInput): PlayerRound {
    return new PlayerRound({
      id: randomUUID(),
      goals: 0,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...playerRound,
    });
  }

  static restore(playerRound: IRestorePlayerRoundInput): PlayerRound {
    return new PlayerRound(playerRound);
  }
}
