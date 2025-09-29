import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GeneralAuthController } from './general-auth.controller';
import { GeneralAuthService } from './general-auth.service';

@Module({
  controllers: [GeneralAuthController],
  providers: [GeneralAuthService, ConfigService, JwtService],
  exports: [GeneralAuthService],
})
export class GeneralAuthModule {}
