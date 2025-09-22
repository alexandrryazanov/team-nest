import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../../users/users.module';
import { VkService } from './vk.service';
import { VkController } from './vk.controller';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [VkController],
  providers: [VkService, PrismaService],
})
export class VkModule {}
