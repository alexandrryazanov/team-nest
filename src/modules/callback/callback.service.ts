import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CallbackService {
  constructor() {}

  async getAll(params) {
    console.log('callback get all is started');

    // return { message: 'callback get all' };

    const { code } = params;

    // Check if code exists
    if (!code) {
      throw new Error("Authorization code missing");
    }

    try {
      // Parameters needed for exchanging code for access token
      const params = {
        client_id: process.env.VK_APP_ID || 'YOUR_CLIENT_ID',
        client_secret: process.env.VK_APP_SECRET || 'YOUR_CLIENT_SECRET',
        redirect_uri: process.env.REDIRECT_URI || 'https://yourdomain.com/callback/vk',
        grant_type: 'authorization_code',
        code: code,
      };

      // Send post request to VK API to obtain access token
      const response = await axios.post(
        'https://oauth.vk.com/access_token',
        null,
        { params },
      );

      if (response.data.error) {
        throw new Error(response.data.error_description);
      }

      // Return success message with the retrieved access token
      return {
        message: "VK Authorization Successful",
        access_token: response.data.access_token,
      };
    } catch (err) {
      return {
        error: err.message || "An unknown error occurred.",
      };
    }
    //   return { message: 'Hello World' };
  }
}
