import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { FeaturesModule } from './modules/features/features.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, FeaturesModule],
})
export class AppModule {}
