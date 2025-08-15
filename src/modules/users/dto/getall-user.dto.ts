import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class GetAllUserDto {
  @ApiPropertyOptional({
    description: 'limit',
    maximum: 100,
    minimum: 1,
    type: Number,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'offset',
    minimum: 0,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset: number = 0;
}
