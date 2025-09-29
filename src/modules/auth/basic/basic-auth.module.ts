import { Module } from '@nestjs/common';
import { CryptService } from '../../crypt/crypt.service';
import { EmailsModule } from '../../emails/emails.module';
import { PrismaService } from '../../prisma/prisma.service';
import { GeneralAuthModule } from '../general/general-auth.module';
import { BasicAuthController } from './basic-auth.controller';
import { BasicAuthService } from './basic-auth.service';

@Module({
  imports: [GeneralAuthModule, EmailsModule],
  controllers: [BasicAuthController],
  providers: [BasicAuthService, CryptService, PrismaService],
})
export class BasicAuthModule {}
