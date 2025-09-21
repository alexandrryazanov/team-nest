import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CallbackController } from './callback.controller';
import { CallbackService } from './callback.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'emails' })],
  controllers: [CallbackController],
  providers: [CallbackService],
})
export class CallbackModule {}
