import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType, SetOptions } from '@redis/client';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  set(key: string, value: string, options?: SetOptions) {
    return this.redis.set(key, value, options);
  }

  get(key: string) {
    return this.redis.get(key);
  }

  del(key: string) {
    return this.redis.del(key);
  }

  async incrWithExpire(key: string, ttlSec: number) {
    try {
      const res = await this.redis.multi().incr(key).expire(key, ttlSec).exec();

      if (!res || res[0] instanceof Error) {
        console.log('Failed to update counter in Redis', { key, ttlSec });
        return 0;
      }

      const incrVal = Number(res[0]);
      return Number.isFinite(incrVal) ? incrVal : 0;
    } catch (e) {
      console.log('Failed to multi incr in Redis', { e, key, ttlSec });
      return 0;
    }
  }

  expire(key: string, seconds: number) {
    return this.redis.expire(key, seconds);
  }
}
