import { PlayersRepository } from '@core/infra/repositories/players.repository';
import { PrismaProvider } from '@framework/infra/database/prisma/prisma.provider';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaProvider, PlayersRepository],
  exports: [PrismaProvider, PlayersRepository],
})
export class DatabaseModule {}
