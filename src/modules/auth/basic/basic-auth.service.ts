import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptService } from '../../crypt/crypt.service';
import { EMAIL_TEMPLATE } from '../../emails/emails.constants';
import { EmailsService } from '../../emails/emails.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GeneralAuthService } from '../general/general-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class BasicAuthService {
  constructor(
    private readonly generalAuthService: GeneralAuthService,
    private readonly prisma: PrismaService,
    private readonly cryptService: CryptService,
    private readonly emailsService: EmailsService,
  ) {}

  async register(dto: RegisterDto) {
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

  async login(dto: LoginDto) {
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

    return this.generalAuthService.generateTokensPair({ sub: user.id });
  }
}
