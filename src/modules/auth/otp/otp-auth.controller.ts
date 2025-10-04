import { Body, Post, Controller } from '@nestjs/common';
import { OtpAuthService } from './otp-auth.service';
import { OtpAuthSendCodeDto } from './dto/send-code.dto';
import { OtpAuthDto } from './dto/otp-auth.dto';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('/auth/otp')
export class OtpAuthController {
  constructor(private readonly otpAuthService: OtpAuthService) {}

  @Post('/login')
  async login(@Body() dto: OtpAuthDto) {
    return await this.otpAuthService.auth(dto);
  }

  @Post('/send-code')
  async sendCode(@Body() dto: OtpAuthSendCodeDto) {
    await this.otpAuthService.sendCode(dto);
  }
}
