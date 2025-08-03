import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUserDto } from './dto/getall-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll({ offset, limit }: GetAllUserDto) {
    try {
      return this.prisma.user.findMany({
        skip: offset,
        take: limit,
      });
    } catch (error) {
      console.log('[USER.SERVICE GET ALL] error:', error);
      throw error;
    }
  }

  async getOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      console.log(
        `[USER.SERVICE GET ONE] error: Can not find user with ID ${id}`,
      );
      throw new NotFoundException(`Can not find user with ID ${id}`);
    }

    return user;
  }

  async create({ email, password }: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: { email, password },
      });
    } catch (error) {
      console.log('[USER.SERVICE CREATE] error:', error);
      throw error;
    }
  }

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      console.log(
        `[USER.SERVICE DELETE] error: Can not find user with ID ${id}`,
      );
      throw new NotFoundException(`Can not find user with ID ${id}`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
