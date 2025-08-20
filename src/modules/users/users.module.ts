import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '../crypt/crypt.service';
import { EmailsConsumer } from '../emails/emails.consumer';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'emails' }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CryptService, JwtService],
})
export class UsersModule {}
