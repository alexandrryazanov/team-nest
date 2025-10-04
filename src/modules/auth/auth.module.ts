import { Module } from '@nestjs/common';
import { BasicAuthModule } from './basic/basic-auth.module';
import { GeneralAuthModule } from './general/general-auth.module';
import { VkAuthModule } from './vk/vk-auth.module';
import { OtpAuthModule } from './otp/otp-auth.module';

@Module({
  imports: [GeneralAuthModule, BasicAuthModule, VkAuthModule, OtpAuthModule],
})
export class AuthModule {}
