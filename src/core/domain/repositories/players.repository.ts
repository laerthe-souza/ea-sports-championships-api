import { Player } from '../entities/player.entity';
import { IFindManyPlayersInputDTO } from './dtos/find-many-players-input.dto';
import { IFindPlayerInputDTO } from './dtos/find-player-input.dto';

export interface IPlayersRepository {
  insert(player: Player): Promise<Player>;
  find(input: IFindPlayerInputDTO): Promise<Player | null>;
  findMany(input: IFindManyPlayersInputDTO): Promise<Player[]>;
  save(player: Player): Promise<Player>;
  delete(player: Player): Promise<void>;
}
