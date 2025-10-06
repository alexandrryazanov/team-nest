import { RedisService } from 'src/modules/redis/redis.service';
import {
  ATTEMPT_TTL,
  LOCK_TTL,
  MAX_ATTEMPTS,
  USER_LOCK_PREFIX,
} from './auth-protection.constants';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthAttemptsService } from './auth-attempts.service';

@Injectable()
export class AuthLockService {
  constructor(
    private readonly redisService: RedisService,
    private readonly authAttemptsService: AuthAttemptsService,
  ) {}

  private getRedisKey(email: string) {
    return `${USER_LOCK_PREFIX}:${email}`;
  }

  async addFailedAttemptOrBlock(
    email: string,
    options?: { maxAttempts?: number; attemptTime?: number; lockTime?: number },
  ) {
    const {
      maxAttempts = MAX_ATTEMPTS,
      attemptTime = ATTEMPT_TTL,
      lockTime = LOCK_TTL,
    } = options ?? {};

    const attempts = await this.authAttemptsService.increment(
      email,
      attemptTime,
    );

    if (attempts >= maxAttempts) {
      await this.createLock(email, lockTime);
      await this.authAttemptsService.clear(email);

      throw new ForbiddenException(
        'Your account has been temporarily suspended. Please try again later.',
      );
    }
  }

  async ensureNotLocked(email: string) {
    const isLocked = await this.isLocked(email);

    if (isLocked) {
      throw new ForbiddenException(
        'Your account has been temporarily suspended. Please try again later.',
      );
    }
  }

  async isLocked(email: string) {
    try {
      return Boolean(await this.redisService.get(this.getRedisKey(email)));
    } catch (e) {
      console.log('Failed to get attempts', { e, email });
      return false;
    }
  }

  async createLock(email: string, lockTimeSec = LOCK_TTL) {
    try {
      await this.redisService.set(this.getRedisKey(email), '1', {
        expiration: { type: 'EX', value: lockTimeSec },
        condition: 'NX',
      });
    } catch (e) {
      console.log('Failed to set block in Redis', {
        email,
        e,
      });
    }
  }

  async clearLock(email: string) {
    try {
      await this.redisService.del(this.getRedisKey(email));
    } catch (e) {
      console.log('Failed to clear lock in Redis', {
        email,
        e,
      });
    }
  }
}
