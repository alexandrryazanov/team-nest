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
import { 
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all registered users',
    description: 'Retrieves a list of all registered users. Restricted to admin users only.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized if no valid token is provided.' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users.' })
  @ApiQuery({ type: GetAllUserDto, description: 'Query parameters for filtering users' })
  @ApiBearerAuth()
  // @ApiBody({
  //   type: GetAllUserDto,
  //   description: 'Get all registered users',
  // })
  @UseGuards(AuthGuard({ adminOnly: true }))
  async getAll(@Query() dto: GetAllUserDto) {
    return await this.usersService.getAll(dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a user by ID', 
    description: 'Retrieves a single user by their ID.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getOne(@Param('id') id: number) {
    return await this.usersService.getOne(id);
  }

  @Delete('/:id')
  @ApiOperation({ 
    summary: 'Delete a user by ID',
    description: 'Deletes a user by their ID. Requires authentication.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized if no valid token is provided.' })
  @ApiResponse({ status: 403, description: 'Forbidden if the user does not have permission.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: number, @UserId() initiatorId: number) {
    return await this.usersService.delete(id, initiatorId);
  }

  @Post('/register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account.',
  })
  @ApiBody({ type: RegisterUserDto, description: 'User registration data' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
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
