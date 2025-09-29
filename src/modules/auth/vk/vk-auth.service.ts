import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { PrismaService } from '../../prisma/prisma.service';
import { GeneralAuthService } from '../general/general-auth.service';
import { AuthVkDto } from './dto/auth-vk.dto';
import { VkAuthErrorResponse, VkAuthSuccessResponse } from './vk-auth.types';

@Injectable()
export class VkAuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly generalAuthService: GeneralAuthService,
  ) {}

  private async auth({ code, deviceId }: AuthVkDto, isRegister: boolean) {
    const form = new URLSearchParams();
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    form.append('client_id', '54139650');
    form.append('device_id', deviceId);
    form.append('code_verifier', 'cO6muH5CxLAo0onMJJJlwYL6KvihK9O4JYG1Ee6e3o8');
    form.append(
      'redirect_uri',
      `https://pablo-cliffy-prognosticatively.ngrok-free.app/${isRegister ? 'register' : 'login'}/vk`,
    );

    const auth = await this.httpService.axiosRef.post<{ access_token: string }>(
      `https://id.vk.com/oauth2/auth`,
      form,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const { data } = await this.httpService.axiosRef.get<
      VkAuthSuccessResponse | VkAuthErrorResponse
    >('https://api.vk.com/method/account.getProfileInfo?v=5.199', {
      headers: { Authorization: `Bearer ${auth.data.access_token}` },
    });

    if ((data as VkAuthErrorResponse).error) {
      throw new UnauthorizedException(
        (data as VkAuthErrorResponse).error.error_msg,
      );
    }

    return (data as VkAuthSuccessResponse).response;
  }

  async register(dto: AuthVkDto) {
    const vkUser = await this.auth(dto, true);

    const existingUser = await this.prisma.vkUser.findUnique({
      where: { id: vkUser.id },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: randomStringGenerator() + '@vk.com',
        hashedPassword: 'no-password',
        vkUser: {
          create: {
            id: vkUser.id,
            firstName: vkUser.first_name,
            lastName: vkUser.last_name,
          },
        },
      },
    });

    return this.generalAuthService.generateTokensPair({ sub: user.id });
  }

  async login(dto: AuthVkDto) {
    const vkUserAuth = await this.auth(dto, false);

    const vkUser = await this.prisma.vkUser.findUnique({
      where: { id: vkUserAuth.id },
      include: {
        user: true,
      },
    });

    if (!vkUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.generalAuthService.generateTokensPair({ sub: vkUser.user.id });
  }
}
