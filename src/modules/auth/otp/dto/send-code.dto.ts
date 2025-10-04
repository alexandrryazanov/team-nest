import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpAuthSendCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
