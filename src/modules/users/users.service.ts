import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { JwtPayload } from '../../types/jwt';
import { CryptService } from '../crypt/crypt.service';
import { EMAIL_TEMPLATE, EmailsType } from '../emails/emails.constants';
import { EmailsService } from '../emails/emails.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GetAllUserDto } from './dto/getall-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptService: CryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectQueue('emails') private emailsQueue: Queue,
    private readonly emailsService: EmailsService,
  ) {}

  async getAll({ offset, limit }: GetAllUserDto) {
    const getAllUsersFeatureFlag = await this.prisma.feature.findUnique({
      where: { name: 'getAllUsers' },
    });

    if (!getAllUsersFeatureFlag?.value) {
      throw new ForbiddenException('Feature flag is disabled');
    }

    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });
  }

  async register(dto: RegisterUserDto) {
    const hashedPassword = await this.cryptService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    try {
      await this.emailsService.sendEmail({
        templateId: EMAIL_TEMPLATE.REGISTER,
        email: dto.email,
        variables: { test: dto.email },
      });
    } catch (e) {
      console.log('Something went wrong when sending email:', {
        e,
        email: dto.email,
      });
    }

    return user;
  }

  async getOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Can not find user with ID ${id}`);
    }

    return user;
  }

  async delete(id: number, initiatorId: number) {
    if (id !== initiatorId) {
      throw new ForbiddenException('You can not delete other user');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Can not find user with ID ${id}`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isSamePassword = await this.cryptService.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!isSamePassword) {
      throw new BadRequestException('Email or password is incorrect');
    }

    await this.emailsQueue.add(EmailsType.SEND_LOGIN_EMAIL, {
      email: user.email,
    });

    return this.generateTokensPair({ sub: user.id });
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
}
