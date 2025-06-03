import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// Assuming prisma client is generated at <project_root>/generated/prisma
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Optional: configure Prisma Client (e.g., logging)
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 