import { Championship } from '../entities/championship.entity';

export interface IChampionshipsRepository {
  insert(championship: Championship): Promise<void>;
  save(championship: Championship): Promise<void>;
  findByPlayerId(playerId: string): Promise<Championship[]>;
  findById(id: string): Promise<Championship | null>;
}
