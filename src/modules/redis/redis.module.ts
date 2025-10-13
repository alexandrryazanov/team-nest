import { Module } from '@nestjs/common';
import { createClient } from '@redis/client';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return createClient()
          .on('error', (err) => console.log('Redis Client Error', err))
          .connect();
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
