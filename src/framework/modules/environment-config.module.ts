import { validateEnvVariables } from '@core/infra/environment-config.validation';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ validate: validateEnvVariables })],
})
export class EnvironmentConfigModule {}
