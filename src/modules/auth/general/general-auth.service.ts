import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../types/jwt';

@Injectable()
export class GeneralAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokensPair(payload: object) {
    const secret = this.configService.get<string>('JWT_KEY');
    const accessExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    const accessToken = await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      { secret, expiresIn: accessExpiresIn },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      { secret, expiresIn: refreshExpiresIn },
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_KEY'),
        },
      );

      return this.generateTokensPair(payload);
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
