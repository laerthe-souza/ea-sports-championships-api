import { PrismaProvider } from '@framework/infra/database/prisma/prisma.provider';
import { Controller, Get } from '@nestjs/common';
import {
  PrismaHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckService,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly healthCheck: HealthCheckService,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly diskHealth: DiskHealthIndicator,
    private readonly prismaProvider: PrismaProvider,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.healthCheck.check([
      () =>
        this.prismaHealth.pingCheck('PrismaConnection', this.prismaProvider),
      () => this.memoryHealth.checkHeap('MemoryHeap', 200 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('MemoryRSS', 3000 * 1024 * 1024),
      () =>
        this.diskHealth.checkStorage('DiskStorage', {
          path: '/',
          thresholdPercent: 0.5,
        }),
    ]);
  }
}
