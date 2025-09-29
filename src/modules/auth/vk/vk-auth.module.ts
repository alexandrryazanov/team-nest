import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeneralAuthModule } from '../general/general-auth.module';
import { VkAuthController } from './vk-auth.controller';
import { VkAuthService } from './vk-auth.service';

@Module({
  imports: [GeneralAuthModule, HttpModule],
  controllers: [VkAuthController],
  providers: [VkAuthService, PrismaService],
})
export class VkAuthModule {}
