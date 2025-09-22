import { Body, Controller, Post } from '@nestjs/common';
import { AuthVkDto } from './dto/auth-vk.dto';
import { VkService } from './vk.service';

@Controller('auth/vk')
export class VkController {
  constructor(private readonly vkService: VkService) {}

  @Post('/register')
  register(@Body() dto: AuthVkDto) {
    return this.vkService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: AuthVkDto) {
    return this.vkService.login(dto);
  }
}
