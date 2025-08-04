import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Injectable()
export class FeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFeatureDto) {
    return this.prisma.feature.create({
      data: {
        name: dto.name,
        value: dto.value,
        payload: dto.payload,
      },
    });
  }

  findAll() {
    return this.prisma.feature.findMany();
  }

  findOne(id: number) {
    return this.prisma.feature.findUnique({ where: { id } });
  }

  findOneByName(name: string) {
    return this.prisma.feature.findUnique({ where: { name } });
  }

  update(id: number, dto: UpdateFeatureDto) {
    return this.prisma.feature.update({
      where: { id },
      data: {
        value: dto.value,
        payload: dto.payload,
      },
    });
  }

  remove(id: number) {
    return this.prisma.feature.delete({ where: { id } });
  }
}
