import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BasicAuthService } from './basic-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('/auth/basic')
export class BasicAuthController {
  constructor(private readonly basicAuthService: BasicAuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.basicAuthService.register(dto);
  }

  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.basicAuthService.login(dto);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }
}
