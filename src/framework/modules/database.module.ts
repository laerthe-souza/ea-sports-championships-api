import { PrismaProvider } from '@framework/infra/database/prisma/prisma.provider';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class DatabaseModule {}
