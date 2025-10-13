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
  OTP_CODE_TTL,
  OTP_CODE_PREFIX,
  OTP_LOCK_TYPE,
} from './otp-auth.constants';
import { EmailsService } from 'src/modules/emails/emails.service';
import { EMAIL_TEMPLATE } from 'src/modules/emails/emails.constants';
import { AUTH_NO_PASSWORD } from '../auth.constants';
import { GeneralAuthService } from '../general/general-auth.service';
import { OtpAuthDto } from './dto/otp-auth.dto';
import { AuthAttemptsService } from '../protection/auth-attempts.service';
import { AuthLockService } from '../protection/auth-lock.service';

type LockType = 'resend' | 'default';

@Injectable()
export class OtpAuthService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly emailsService: EmailsService,
    private readonly generalAuthService: GeneralAuthService,
    private readonly authAttemptsService: AuthAttemptsService,
    private readonly authLockService: AuthLockService,
  ) {}

  private getOtpRedisKey(email: string) {
    return `${OTP_CODE_PREFIX}:${email}`;
  }

  async auth(
    dto: OtpAuthDto,
    options?: { isRegistrationAllowed?: boolean; lockType?: LockType },
  ) {
    const { isRegistrationAllowed = false, lockType = OTP_LOCK_TYPE } =
      options ?? {};

    await this.ensureNotLocked(dto.email, lockType);
    await this.verifyAndConsumeCode(dto, lockType);

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

  async sendCode(
    { email }: OtpAuthSendCodeDto,
    lockType: LockType = OTP_LOCK_TYPE,
  ) {
    await this.ensureNotLocked(email, lockType);

    const otpCode =
      await this.cryptService.generateHashedNumCode(OTP_CODE_LENGTH);

    try {
      await this.redisService.set(this.getOtpRedisKey(email), otpCode, {
        expiration: { type: 'EX', value: OTP_CODE_TTL },
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

  private async verifyAndConsumeCode(
    { email, code }: OtpAuthDto,
    lockType: LockType,
  ) {
    const redisKey = this.getOtpRedisKey(email);
    let otpCode: string | null = null;

    try {
      otpCode = await this.redisService.get(redisKey);
    } catch {
      throw new InternalServerErrorException('Failed to get OTP code');
    }

    if (!otpCode) throw new BadRequestException('Code is invalid');

    const isSameCode = await this.cryptService.compare(code, otpCode);

    if (!isSameCode) {
      await this.userLock(email, lockType);
      throw new BadRequestException('Code is incorrect');
    }

    try {
      await this.redisService.del(redisKey);
    } catch (e) {
      console.log('Failed to delete verified OTP code in Redis:', {
        e,
        code,
      });
    }

    await this.authAttemptsService.clear(email);
  }

  private ensureNotLocked(email: string, lockType: LockType) {
    return lockType === 'resend'
      ? this.authAttemptsService.ensureNotLocked(email)
      : this.authLockService.ensureNotLocked(email);
  }

  private userLock(email: string, lockType: LockType) {
    return lockType === 'resend'
      ? this.blockByResendCode(email)
      : this.blockByNewRedisKey(email);
  }

  private async blockByResendCode(email: string) {
    const { isLocked } =
      await this.authAttemptsService.addFailedAttemptOrBlock(email);

    if (isLocked) {
      await this.authAttemptsService.clear(email);
      await this.sendCode({ email });
    }
  }

  private async blockByNewRedisKey(email: string) {
    await this.authLockService.addFailedAttemptOrBlock(email);
  }
}
