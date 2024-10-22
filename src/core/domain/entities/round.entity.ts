import { randomUUID } from 'crypto';

import { shuffleArray } from '@core/application/utils/shuffle-array';

import { PlayerRound } from './player-round.entity';
import { Player } from './player.entity';

type IRoundDTO = {
  id: string;
  championshipId: string;
  hasPlayed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type IPlayerRoundStats = {
  playerId: string;
  goalsScored: number;
  goalsConceded: number;
  win: boolean;
  draw: boolean;
  lose: boolean;
};

type IFinishRoundInput = {
  requestedBy: string;
  playersRounds: Array<{
    id: string;
    goals: number;
    playerId: string;
  }>;
};

type IConstructorInput = {
  id: string;
  championshipId: string;
  hasPlayed: boolean;
  createdAt: Date;
  updatedAt: Date;
  playersRounds: PlayerRound[];
};

type IPlayerRound = {
  playerId: string;
  playerName: string;
  isHome: boolean;
};

type ICreateRoundInput = {
  id: string;
  championshipId: string;
  playersRounds: IPlayerRound[];
};

type IRounds = {
  roundId: string;
  playersRounds: IPlayerRound[];
};

type IRestoreRoundInput = {
  id: string;
  championshipId: string;
  hasPlayed: boolean;
  createdAt: Date;
  updatedAt: Date;
  playersRounds: PlayerRound[];
};

export class Round {
  private id: string;
  private championshipId: string;
  private hasPlayed: boolean;
  private createdAt: Date;
  private updatedAt: Date;
  private playersRounds: PlayerRound[];

  private constructor(round: IConstructorInput) {
    this.id = round.id;
    this.championshipId = round.championshipId;
    this.hasPlayed = round.hasPlayed;
    this.createdAt = round.createdAt;
    this.updatedAt = round.updatedAt;
    this.playersRounds = round.playersRounds;
  }

  get getData(): IRoundDTO {
    const { championshipId, createdAt, hasPlayed, id, updatedAt } = this;

    return {
      championshipId,
      createdAt,
      hasPlayed,
      id,
      updatedAt,
    };
  }

  get getPlayerRounds(): PlayerRound[] {
    return this.playersRounds;
  }

  finish(data: IFinishRoundInput): void {
    if (this.hasPlayed) {
      throw new Error("This round's score can no longer be changed");
    }

    const canChangeRoundScore = this.playersRounds.some(
      ({ getData }) => getData.playerId === data.requestedBy,
    );

    if (!canChangeRoundScore) {
      throw new Error(
        'Only players who played this round can change the score',
      );
    }

    const requestedPlayerRound = data.playersRounds.find(
      ({ playerId }) => playerId === data.requestedBy,
    );
    const otherPlayerRound = data.playersRounds.find(
      ({ playerId }) => playerId !== data.requestedBy,
    );
    const requestedSavedPlayerRound = this.getPlayerRounds.find(
      ({ getData }) => getData.id === requestedPlayerRound?.id,
    );
    const otherSavedPlayerRound = this.getPlayerRounds.find(
      ({ getData }) => getData.id === otherPlayerRound?.id,
    );

    if (
      !requestedPlayerRound ||
      !otherPlayerRound ||
      !requestedSavedPlayerRound ||
      !otherSavedPlayerRound
    ) {
      throw new Error('Player round not found');
    }

    if (
      (requestedSavedPlayerRound.getData.confirmed ||
        otherSavedPlayerRound.getData.confirmed) &&
      (requestedPlayerRound.goals !== requestedSavedPlayerRound.getData.goals ||
        otherPlayerRound.goals !== otherSavedPlayerRound.getData.goals)
    ) {
      requestedSavedPlayerRound.reopen();
      otherSavedPlayerRound.reopen();
    }

    requestedSavedPlayerRound.confirm();

    requestedSavedPlayerRound.addGoals(requestedPlayerRound.goals);
    otherSavedPlayerRound.addGoals(otherPlayerRound.goals);

    if (
      requestedSavedPlayerRound.getData.confirmed &&
      otherSavedPlayerRound.getData.confirmed
    ) {
      this.hasPlayed = true;
    }
  }

  calculateStats(): IPlayerRoundStats[] {
    const playerOne = this.getPlayerRounds[0].getData;
    const playerTwo = this.getPlayerRounds[1].getData;

    const playerOneStats: IPlayerRoundStats = {
      win: playerOne.goals > playerTwo.goals,
      draw: playerOne.goals === playerTwo.goals,
      lose: playerOne.goals < playerTwo.goals,
      goalsScored: playerOne.goals,
      goalsConceded: playerTwo.goals,
      playerId: playerOne.playerId,
    };

    const playerTwoStats: IPlayerRoundStats = {
      win: playerTwo.goals > playerOne.goals,
      draw: playerTwo.goals === playerOne.goals,
      lose: playerTwo.goals < playerOne.goals,
      goalsScored: playerTwo.goals,
      goalsConceded: playerOne.goals,
      playerId: playerTwo.playerId,
    };

    return [playerOneStats, playerTwoStats];
  }

  static create(round: ICreateRoundInput): Round {
    const playersRounds = round.playersRounds.map(playerRound =>
      PlayerRound.create({
        isHome: playerRound.isHome,
        playerId: playerRound.playerId,
        playerName: playerRound.playerName,
        roundId: round.id,
      }),
    );

    if (playersRounds.length !== 2) {
      throw new Error('Each round must be have exactly two players round');
    }

    return new Round({
      id: round.id,
      championshipId: round.championshipId,
      playersRounds,
      hasPlayed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(round: IRestoreRoundInput): Round {
    return new Round(round);
  }

  static generate(players: Player[]): IRounds[] {
    const randomPlayers = shuffleArray(
      players.map(({ getData }) => ({ id: getData.id, name: getData.name })),
    );

    const rounds: IRounds[] = [];
    const numPlayers = randomPlayers.length;

    for (let i = 0; i < numPlayers; i += 1) {
      for (let j = i + 1; j < numPlayers; j += 1) {
        rounds.push({
          roundId: randomUUID(),
          playersRounds: [
            {
              isHome: true,
              playerId: randomPlayers[i].id,
              playerName: randomPlayers[i].name,
            },
            {
              isHome: false,
              playerId: randomPlayers[j].id,
              playerName: randomPlayers[j].name,
            },
          ],
        });
      }
    }

    for (let i = 0; i < numPlayers; i += 1) {
      for (let j = i + 1; j < numPlayers; j += 1) {
        rounds.push({
          roundId: randomUUID(),
          playersRounds: [
            {
              isHome: true,
              playerId: randomPlayers[j].id,
              playerName: randomPlayers[j].name,
            },
            {
              isHome: false,
              playerId: randomPlayers[i].id,
              playerName: randomPlayers[i].name,
            },
          ],
        });
      }
    }

    return rounds;
  }
}
