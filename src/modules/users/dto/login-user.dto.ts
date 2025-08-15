import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'User\'s email adress, should be unique among all users',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User\'s password',
    minLength: 1,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
