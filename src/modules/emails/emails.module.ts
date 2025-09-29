import { Module } from '@nestjs/common';
import { EmailsConsumer } from './emails.consumer';
import { EmailsService } from './emails.service';

@Module({
  providers: [EmailsConsumer, EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
