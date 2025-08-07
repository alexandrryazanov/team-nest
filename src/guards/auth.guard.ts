import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt';
import { PrismaService } from '../modules/prisma/prisma.service';

export interface AuthGuardOptions {
  adminOnly?: boolean;
}

export function AuthGuard(
  options: AuthGuardOptions = {
    adminOnly: false,
  },
): Type<CanActivate> {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
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

      if (options.adminOnly) {
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.sub },
          select: { isAdmin: true },
        });
        if (!user) {
          throw new ForbiddenException('User id from token is invalid');
        }

        if (!user.isAdmin) {
          // we can put here any comment
          throw new ForbiddenException('Admin access required');
        }
      }

      return true;
    }
  }

  return mixin(AuthGuardMixin);
}
