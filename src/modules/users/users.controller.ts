/* eslint-disable prettier/prettier */
import { UserId } from '../../decorators/user-id.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  BadRequestException,
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
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiExtraModels(GetAllUserDto, RegisterUserDto, LoginUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all registered users',
    description: 'Retrieves a list of all registered users. Restricted to admin users only.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of users.'})
  @ApiResponse({ status: 401, description: 'Unauthorized if no valid token is provided.' })
  @ApiResponse({ status: 403, description: 'Forbidden for non-admin users.' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard({ adminOnly: true }))
  async getAll(@Query() dto: GetAllUserDto) {
    return await this.usersService.getAll(dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a user by ID', 
    description: 'Retrieves a single user by their ID.',
  })
  @ApiParam({ 
    name: 'id',
    type: Number,
    description: 'The ID of the user to retrieve',
    example: 1,
    required: true,
  })
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
  @ApiParam({ 
    name: 'id',
    type: Number,
    description: 'The ID of the user to delete',
    example: 1,
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Successfully deleted the user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized if no valid token is provided.' })
  @ApiResponse({ status: 403, description: 'Forbidden if the user does not have permission.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: number, @UserId() initiatorId: number) {
    return await this.usersService.delete(id, initiatorId);
  }

  @Post('/register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account.',
  })
  @ApiBody({
    type: RegisterUserDto,
    description: 'User registration data',
    examples: {
      example1: {
        summary: 'Sample registration data',
        value: {
          email: 'example@example.com',
          password: 'Password123!',
        },
      },
    },
  })
  // @ApiBody({ type: RegisterUserDto, description: 'User registration data' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('/login')
  @ApiOperation({ 
    summary: 'Login already registered user',
    description: 'User login by sending user email and password',
  })
  @ApiBody({
    type: RegisterUserDto,
    description: 'User registration data',
    examples: {
      example1: {
        summary: 'Sample registration data',
        value: {
          email: 'example@example.com',
          password: 'Password123!',
        },
      },
    }
  })
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.usersService.login(dto);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/refresh')
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Refresh access token by sending refresh token to the server',
  })
  @ApiResponse({ status: 200, description: 'Successfully refreshed token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    //TODO: Can we add here some decorator instead of checking that cookies are present?
    if (!request.cookies) {
      throw new BadRequestException('Cookie is not provided');
    }
    if (!request.cookies.refreshToken) {
      throw new BadRequestException('Refresh token is not provided in cookies');
    }
    const token: string = request.cookies['refreshToken'];
    const { accessToken, refreshToken } =
      await this.usersService.refresh(token);
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('/logout')
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Make user logout',
  })
  @ApiResponse({ status: 201, description: 'User successfully logout.' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', { httpOnly: true });
    return 'OK';
  }
}
