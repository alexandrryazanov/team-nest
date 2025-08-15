import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeatureDto {
  @ApiProperty({
    description: 'feature name',
    type: String,
    minLength: 1,
    maxLength: 100,
    example: 'geaAllUsers',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'feature flag',
    type: Boolean,
  })
  @IsBoolean()
  value: boolean;

  @ApiPropertyOptional({
    description: 'feature object - ?',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  payload?: object;
}
