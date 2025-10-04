import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { OTP_CODE_LENGTH } from '../otp-auth.constants';

export class OtpAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(OTP_CODE_LENGTH)
  code: string;
}
