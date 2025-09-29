import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllUserDto } from './dto/getall-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll({ offset, limit }: GetAllUserDto) {
    const getAllUsersFeatureFlag = await this.prisma.feature.findUnique({
      where: { name: 'getAllUsers' },
    });

    if (!getAllUsersFeatureFlag?.value) {
      throw new ForbiddenException('Feature flag is disabled');
    }

    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });
  }

  async getOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Can not find user with ID ${id}`);
    }

    return user;
  }

  async delete(id: number, initiatorId: number) {
    if (id !== initiatorId) {
      throw new ForbiddenException('You can not delete other user');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Can not find user with ID ${id}`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
