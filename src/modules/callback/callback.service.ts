import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CallbackService {
  private readonly tokenUrl = 'https://oauth.vk.com/access_token';

  constructor() {}

  async authCallback(code: string): Promise<{
    accessToken: string;
    userId: number;
    email?: string;
    refreshToken?: string;
  }> {
    console.log('callback get all is started');

    const clientId = process.env.VK_CLIENT_ID;
    const clientSecret = process.env.VK_CLIENT_SECRET;
    const redirectUri = 'https://moanful-pentavalent-le.ngrok-free.app/auth/vk/callback2';

    // Prepare query parameters for the POST request
    // @ts-ignore
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    try {
      // Send POST request to VK's token endpoint
      const response = await axios.post(this.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, user_id, email, refresh_token } = response.data;

      if (!access_token) {
        throw new UnauthorizedException(
          'Failed to obtain access token from VK',
        );
      }

      return {
        accessToken: access_token,
        userId: user_id,
        email,
        refreshToken: refresh_token, // Only returned if 'offline' scope was requested
      };
    } catch (error) {
      console.error(
        'VK Token Exchange Error:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('Invalid VK code or configuration');
    }
  }
}
