import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateFeatureDto {
  @IsOptional()
  @IsBoolean()
  value?: boolean;

  @IsOptional()
  @IsObject()
  payload?: object;
}
