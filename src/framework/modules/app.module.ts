import { EnvironmentConfigModule } from '@framework/modules/environment-config.module';
import { Module } from '@nestjs/common';

import { CustomLoggerModule } from './custom-logger.module';

@Module({
  imports: [CustomLoggerModule, EnvironmentConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
