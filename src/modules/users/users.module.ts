import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '../crypt/crypt.service';
import { EmailsModule } from '../emails/emails.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'emails' }), EmailsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CryptService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
