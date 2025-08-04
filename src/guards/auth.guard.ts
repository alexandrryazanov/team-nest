import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization as string;
    const token = authorizationHeader?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('Token is not provided');
    }

    let payload: JwtPayload;
    try {
      const secret = this.configService.get<string>('JWT_KEY');
      payload = await this.jwtService.verifyAsync(token, { secret });
      request['userId'] = payload.sub;
    } catch {
      throw new ForbiddenException('Token is invalid');
    }

    if (payload.type !== 'access') {
      throw new ForbiddenException('Token is invalid');
    }

    return true;
  }
}
