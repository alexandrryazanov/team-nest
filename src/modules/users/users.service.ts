import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CryptService } from '../crypt/crypt.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GetAllUserDto } from './dto/getall-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptService: CryptService,
  ) {}

  async getAll({ offset, limit }: GetAllUserDto) {
    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });
  }

  async register(dto: RegisterUserDto) {
    const salt = await this.cryptService.generateSalt();
    const hashedPassword = await this.cryptService.hash(dto.password, salt);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
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

  async delete(id: number) {
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

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const isSamePassword = await this.cryptService.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!isSamePassword) {
      throw new BadRequestException('Email or password is incorrect');
    }

    return 'You are logged in!';
  }
}
