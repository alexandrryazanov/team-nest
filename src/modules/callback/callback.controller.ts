import {
  Body,
  Controller,
  Get, Query, Res,
} from '@nestjs/common';
import { CallbackService } from './callback.service';

@Controller('auth/vk/')
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @Get('/callback')
  async callback(@Query() params, @Res() res: Response) {
    console.log('callback controller is started');

    const { code } = params;

    if (!code) {
      console.log('No code provided');
      return { error: 'No code provided' };
    }

    try {
      const { accessToken, userId, email, refreshToken } =
        await this.callbackService.authCallback(code);
      // TODO: Store token, create user session, or issue JWT
      return {
        message: 'Token obtained successfully',
        accessToken,
        userId,
        email,
        refreshToken,
      };
    } catch (error) {
      console.error('Auth Callback Error:', error);
      return { error: 'Authentication failed' };
    }
  }
}
