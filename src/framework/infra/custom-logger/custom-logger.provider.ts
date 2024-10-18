import { Logger } from '@nestjs/common';

export class CustomLoggerProvider {
  private logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  info(msg: string, ...args: any[]): void {
    return this.logger.log({
      msg,
      ...args,
    });
  }

  warn(msg: string, ...args: any[]): void {
    return this.logger.warn({
      msg,
      ...args,
    });
  }

  error(msg: string, ...args: any[]): void {
    return this.logger.error({
      msg,
      ...args,
    });
  }
}
