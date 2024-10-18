import { EnvironmentConfigModule } from '@framework/modules/environment-config.module';
import { Module } from '@nestjs/common';

import { CustomLoggerModule } from './custom-logger.module';
import { DatabaseModule } from './database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    CustomLoggerModule,
    EnvironmentConfigModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
