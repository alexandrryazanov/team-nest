import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetAllUserDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  offset: number = 0;
}
