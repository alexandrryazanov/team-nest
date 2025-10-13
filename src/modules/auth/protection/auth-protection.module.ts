import { Module } from '@nestjs/common';
import { RedisModule } from 'src/modules/redis/redis.module';
import { AuthAttemptsService } from './auth-attempts.service';
import { AuthLockService } from './auth-lock.service';

@Module({
  imports: [RedisModule],
  providers: [AuthAttemptsService, AuthLockService],
  exports: [AuthAttemptsService, AuthLockService],
})
export class AuthProtectionModule {}
