import { IsString } from 'class-validator';

export class AuthVkDto {
  @IsString()
  code: string;

  @IsString()
  deviceId: string;
}
