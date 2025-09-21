import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './modules/emails/emails.module';
import { UsersModule } from './modules/users/users.module';
import { FeaturesModule } from './modules/features/features.module';
import { HealthModule } from './modules/health/health.module';
import { StorageModule } from './modules/storage/storage.module';
import { CallbackModule } from './modules/callback/callback.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/public'), // Path to the folder containing index.html
      renderPath: '/', // Serve index.html at the root URL
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ connection: { host: 'localhost', port: 6379 } }),
    UsersModule,
    FeaturesModule,
    HealthModule,
    EmailsModule,
    // StorageModule,
    CallbackModule,
  ],
})
export class AppModule {}
