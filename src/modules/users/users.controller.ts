import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserId } from '../../decorators/user-id.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { GetAllUserDto } from './dto/getall-user.dto';
import { UsersService } from './users.service';

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
}
