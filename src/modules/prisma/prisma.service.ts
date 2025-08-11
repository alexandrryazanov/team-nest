import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.$queryRaw`SELECT 1`;
      return { db: { status: 'up' } };
    } catch {
      return { db: { status: 'down', error: 'db is down' } };
    }
  }
}
