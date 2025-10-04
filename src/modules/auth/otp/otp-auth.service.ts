import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpAuthSendCodeDto } from './dto/send-code.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CryptService } from 'src/modules/crypt/crypt.service';
import { RedisService } from 'src/modules/redis/redis.service';
import {
  OTP_CODE_LENGTH,
  OTP_CODE_LIFETIME,
  OTP_CODE_PREFIX,
} from './otp-auth.constants';
import { EmailsService } from 'src/modules/emails/emails.service';
import { EMAIL_TEMPLATE } from 'src/modules/emails/emails.constants';
import { AUTH_NO_PASSWORD } from '../auth.constants';
import { GeneralAuthService } from '../general/general-auth.service';
import { OtpAuthDto } from './dto/otp-auth.dto';

@Injectable()
export class OtpAuthService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly prisma: PrismaService,
    private readonly redisSerivce: RedisService,
    private readonly emailsService: EmailsService,
    private readonly generalAuthService: GeneralAuthService,
  ) {}

  async auth(dto: OtpAuthDto, isRegistrationAllowed = false) {
    await this.checkValidityCode(dto);

    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      if (isRegistrationAllowed) {
        user = await this.register(dto);
      } else {
        throw new UnauthorizedException('User not found');
      }
    }

    return this.generalAuthService.generateTokensPair({ sub: user.id });
  }

  async sendCode({ email }: OtpAuthSendCodeDto) {
    const otpCode =
      await this.cryptService.generateHashedNumCode(OTP_CODE_LENGTH);

    try {
      await this.redisSerivce.set(`${OTP_CODE_PREFIX}:${email}`, otpCode, {
        EX: OTP_CODE_LIFETIME,
      });
    } catch {
      throw new InternalServerErrorException('Failed to save OTP code');
    }

    try {
      await this.emailsService.sendEmail({
        templateId: EMAIL_TEMPLATE.REGISTER,
        email,
        variables: { test: email },
      });
    } catch (e) {
      console.log('OTP Code. Something went wrong when sending email:', {
        e,
        email,
      });
    }
  }

  private async register(dto: OtpAuthDto) {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword: AUTH_NO_PASSWORD,
      },
    });

    try {
      await this.emailsService.sendEmail({
        templateId: EMAIL_TEMPLATE.REGISTER,
        email: dto.email,
        variables: { test: dto.email },
      });
    } catch (e) {
      console.log(
        'User registration using OTP code. Something went wrong when sending email:',
        {
          e,
          email: dto.email,
        },
      );
    }

    return user;
  }

  private async checkValidityCode({ email, code }: OtpAuthDto) {
    let otpCode: string | null = null;

    try {
      otpCode = await this.redisSerivce.get(`${OTP_CODE_PREFIX}:${email}`);
    } catch {
      throw new InternalServerErrorException('Failed to get OTP code');
    }

    if (!otpCode) throw new BadRequestException('Code is invalid');

    const isSameCode = await this.cryptService.compare(code, otpCode);

    if (!isSameCode) {
      throw new BadRequestException('Code is incorrect');
    }

    return otpCode;
  }
}
