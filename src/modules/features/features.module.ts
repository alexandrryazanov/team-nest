import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesService, PrismaService],
})
export class FeaturesModule {}
