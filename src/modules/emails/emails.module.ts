import { Module } from '@nestjs/common';
import { EmailsConsumer } from './emails.consumer';

@Module({
  providers: [EmailsConsumer],
})
export class EmailsModule {}
