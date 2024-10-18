import { CustomLoggerProvider } from '@framework/infra/custom-logger/custom-logger.provider';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit {
  private logger = new CustomLoggerProvider(PrismaProvider.name);

  async onModuleInit() {
    await this.$connect();

    this.logger.info('Postgres database connected');
  }
}
