import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthVkDto } from './dto/auth-vk.dto';

@Injectable()
export class VkService {
  constructor(private readonly httpService: HttpService) {}

  async auth({ code, deviceId }: AuthVkDto) {
    const form = new URLSearchParams();
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    form.append('client_id', '54139650');
    form.append('device_id', deviceId);
    form.append('code_verifier', 'cO6muH5CxLAo0onMJJJlwYL6KvihK9O4JYG1Ee6e3o8');
    form.append(
      'redirect_uri',
      'https://pablo-cliffy-prognosticatively.ngrok-free.app/profile',
    );

    const auth = await this.httpService.axiosRef.post(
      `https://id.vk.com/oauth2/auth`,
      form,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    // console.log(auth.data);

    const user = await this.httpService.axiosRef.get(
      'https://api.vk.com/method/account.getProfileInfo?v=5.199',
      { headers: { Authorization: `Bearer ${auth.data.access_token}` } },
    );

    console.log(user.data);

    return true;
  }
}
