import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './modules/emails/emails.module';
import { UsersModule } from './modules/users/users.module';
import { FeaturesModule } from './modules/features/features.module';
import { HealthModule } from './modules/health/health.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
    UsersModule,
    FeaturesModule,
    HealthModule,
    EmailsModule,
    StorageModule,
  ],
})
export class AppModule {}
