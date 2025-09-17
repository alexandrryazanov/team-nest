import { Body, Controller, Post } from '@nestjs/common';
import { AuthVkDto } from './dto/auth-vk.dto';
import { VkService } from './vk.service';

@Controller('auth/vk')
export class VkController {
  constructor(private readonly vkService: VkService) {}

  @Post()
  auth(@Body() dto: AuthVkDto) {
    return this.vkService.auth(dto);
  }
}
