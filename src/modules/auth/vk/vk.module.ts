import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { VkController } from './vk.controller';

@Module({
  imports: [HttpModule],
  controllers: [VkController],
  providers: [VkService],
})
export class VkModule {}
