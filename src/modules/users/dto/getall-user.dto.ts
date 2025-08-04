import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class GetAllUserDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset: number = 0;
}
