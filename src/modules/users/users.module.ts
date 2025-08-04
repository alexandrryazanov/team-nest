import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '../crypt/crypt.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CryptService, JwtService],
})
export class UsersModule {}
