import { Championship } from '../entities/championship.entity';

export interface IChampionshipsRepository {
  insert(championship: Championship): Promise<Championship>;
  save(championship: Championship): Promise<Championship>;
  findByPlayerId(playerId: string): Promise<Championship[]>;
  findById(id: string): Promise<Championship | null>;
}
