import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  MinLength,
} from 'class-validator';

export class OtpAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(3)
  code: string;
}
