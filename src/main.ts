import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from '@framework/modules/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);

  app.useLogger(logger);
  app.enableCors({ credentials: true, origin: '*' });
  app.use(helmet());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(process.env.PORT, () =>
    logger.log(
      `Server is running on port ${process.env.PORT}`,
      'NestApplication',
    ),
  );
}
bootstrap();
