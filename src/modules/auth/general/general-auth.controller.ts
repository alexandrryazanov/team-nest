import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GeneralAuthService } from './general-auth.service';

@Controller('/auth')
export class GeneralAuthController {
  constructor(private readonly authService: GeneralAuthService) {}

  @Post('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: string = request.cookies['refreshToken'];
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', { httpOnly: true });
    return 'OK';
  }
}
