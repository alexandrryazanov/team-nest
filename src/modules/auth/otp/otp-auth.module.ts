import { Module } from '@nestjs/common';
import { OtpAuthService } from './otp-auth.service';
import { OtpAuthController } from './otp-auth.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CryptService } from 'src/modules/crypt/crypt.service';
import { RedisModule } from 'src/modules/redis/redis.module';
import { EmailsModule } from 'src/modules/emails/emails.module';
import { GeneralAuthModule } from '../general/general-auth.module';
import { AuthProtectionModule } from '../protection/auth-protection.module';

@Module({
  imports: [RedisModule, EmailsModule, GeneralAuthModule, AuthProtectionModule],
  controllers: [OtpAuthController],
  providers: [OtpAuthService, PrismaService, CryptService],
})
export class OtpAuthModule {}
