import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new feature',
    description: 'Create new feature',
  })
  @ApiBody({
    type: CreateFeatureDto,
    description: 'New feature description',
    examples: {
      example1: {
        summary: 'Sample feature',
        value: {
          name: 'getAllUsers',
          value: true,
        },
      },
    },
  })
  // @ApiBody({ type: RegisterUserDto, description: 'User registration data' })
  @ApiResponse({ status: 201, description: 'New feature created' })
  @ApiResponse({ status: 400, description: 'Invalid feature' })
  @ApiResponse({
    status: 409,
    description: 'Provided feature name is already exist',
  })
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of all features',
    description: 'Get list of all features',
  })
  @ApiResponse({ status: 200, description: 'Feature list is provided' })
  findAll() {
    return this.featuresService.findAll();
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get a feature by name',
    description: 'Get a feature by name',
  })
  @ApiResponse({ status: 200, description: 'Feature is provided' })
  findOne(@Param('name') name: string) {
    return this.featuresService.findOneByName(name);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update feature by id',
    description: 'Update feature by id',
  })
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featuresService.update(+id, updateFeatureDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete feature by id',
    description: 'Delete feature by id',
  })
  @ApiResponse({ status: 200, description: 'Feature is deleted' })
  @ApiResponse({ status: 400, description: 'Feature is not found' })
  remove(@Param('id') id: string) {
    return this.featuresService.remove(+id);
  }
}
