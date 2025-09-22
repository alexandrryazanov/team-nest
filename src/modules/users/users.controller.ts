import { UserId } from '../../decorators/user-id.decorator';
import { AuthGuard } from '../../guards/auth.guard';
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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetAllUserDto } from './dto/getall-user.dto';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard())
  async getMe(@UserId() userId: number) {
    return await this.usersService.getOne(userId);
  }

  @Get('/')
  @UseGuards(AuthGuard({ adminOnly: true }))
  async getAll(@Query() dto: GetAllUserDto) {
    return await this.usersService.getAll(dto);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.usersService.getOne(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: number, @UserId() initiatorId: number) {
    return await this.usersService.delete(id, initiatorId);
  }

  @Post('/register')
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('/login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.usersService.login(dto);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: string = request.cookies['refreshToken'];
    const { accessToken, refreshToken } =
      await this.usersService.refresh(token);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', { httpOnly: true });
    return 'OK';
  }
}
