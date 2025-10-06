import { RedisService } from 'src/modules/redis/redis.service';
import {
  ATTEMPT_TTL,
  MAX_ATTEMPTS,
  USER_ATTEMPTS_PREFIX,
} from './auth-protection.constants';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthAttemptsService {
  constructor(private readonly redisService: RedisService) {}

  private getRedisKey(email: string) {
    return `${USER_ATTEMPTS_PREFIX}:${email}`;
  }

  async addFailedAttemptOrBlock(
    email: string,
    options?: { maxAttempts?: number; attemptTime?: number },
  ) {
    const { maxAttempts = MAX_ATTEMPTS, attemptTime = ATTEMPT_TTL } =
      options ?? {};

    const attempts = await this.increment(email, attemptTime);

    return { isLocked: attempts >= maxAttempts, attempts };
  }

  async ensureNotLocked(email: string, maxAttempts = MAX_ATTEMPTS) {
    const attempts = await this.get(email);

    if (attempts >= maxAttempts) {
      throw new ForbiddenException(
        'Your account has been temporarily suspended. Please try again later.',
      );
    }
  }

  async get(email: string) {
    try {
      return Number(await this.redisService.get(this.getRedisKey(email)));
    } catch (e) {
      console.log('Failed to get attempts', { e, email });
      return 0;
    }
  }

  async increment(email: string, attemptTimeSec = ATTEMPT_TTL) {
    return await this.redisService.incrWithExpire(
      this.getRedisKey(email),
      attemptTimeSec,
    );
  }

  async clear(email: string) {
    try {
      await this.redisService.del(this.getRedisKey(email));
    } catch (e) {
      console.log('Failed to delete attempts in Redis', {
        email,
        e,
      });
    }
  }
}
