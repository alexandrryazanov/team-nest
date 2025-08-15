import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFeatureDto {
  @ApiPropertyOptional({
    description: 'feature flag',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  value?: boolean;

  @ApiPropertyOptional({
    description: 'feature object - ?',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  payload?: object;
}
