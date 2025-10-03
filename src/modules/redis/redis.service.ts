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
}
