import { Body, Controller, Post } from '@nestjs/common';
import { AuthVkDto } from './dto/auth-vk.dto';
import { VkAuthService } from './vk-auth.service';

@Controller('/auth/vk')
export class VkAuthController {
  constructor(private readonly vkService: VkAuthService) {}

  @Post('/register')
  register(@Body() dto: AuthVkDto) {
    return this.vkService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: AuthVkDto) {
    return this.vkService.login(dto);
  }
}
