import { Player } from '../player.entity';
import { IFindPlayerInputDTO } from './dtos/find-player-input.dto';

export interface IPlayersRepository {
  insert(player: Player): Promise<Player>;
  find(input: IFindPlayerInputDTO): Promise<Player | null>;
  save(player: Player): Promise<Player>;
  delete(player: Player): Promise<void>;
}
