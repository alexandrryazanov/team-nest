import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'user email',
    example: 'user@email.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'user password',
    minLength: 1,
    example: 'password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
