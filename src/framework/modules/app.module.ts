import { EnvironmentConfigModule } from '@framework/modules/environment-config.module';
import { Module } from '@nestjs/common';

import { CustomLoggerModule } from './custom-logger.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [CustomLoggerModule, EnvironmentConfigModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
