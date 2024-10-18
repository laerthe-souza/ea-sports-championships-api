import { LoggerModule } from 'nestjs-pino';

import { CustomLoggerProvider } from '@framework/infra/custom-logger/custom-logger.provider';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport:
          process.env.NODE_ENV === 'local'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: false,
                },
              }
            : undefined,
      },
    }),
  ],
  providers: [CustomLoggerProvider],
  exports: [CustomLoggerProvider],
})
export class CustomLoggerModule {}
