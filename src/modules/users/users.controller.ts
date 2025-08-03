import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUserDto } from './dto/getall-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAll(@Query() dto: GetAllUserDto) {
    return await this.usersService.getAll(dto);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.usersService.getOne(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }

  @Post('/register')
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }
}
