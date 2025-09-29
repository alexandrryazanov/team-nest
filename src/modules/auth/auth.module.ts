import { Module } from '@nestjs/common';
import { BasicAuthModule } from './basic/basic-auth.module';
import { GeneralAuthModule } from './general/general-auth.module';
import { VkAuthModule } from './vk/vk-auth.module';

@Module({
  imports: [GeneralAuthModule, BasicAuthModule, VkAuthModule],
})
export class AuthModule {}
