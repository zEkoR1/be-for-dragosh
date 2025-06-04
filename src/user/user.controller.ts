import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import {PaginatedUsers, UserService} from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as PrismaUser } from '../../generated/prisma';
import { AdminGuard } from '../guards/isAdminGuard';
import { AdminOrOwnerGuard } from '../guards/admin-or-owner.guard';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates User
   *
   * @param createUserDto {CreateUserDto}
   */
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully. Password is omitted in the response.',
  })
  @ApiResponse({ status: 409, description: 'Conflict: email or username already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post()
  async create(
      @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<PrismaUser, 'password'>> {
    return this.userService.create(createUserDto);
  }

  /**
   * Find all users, restricted access: admin only.
   */
  @ApiOperation({ summary: 'Retrieve all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users. Password fields are omitted.',
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAll(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
  ): Promise<PaginatedUsers> {
    return this.userService.findAll(page, limit);
  }

  /**
   * Get user by id. User sees only his profile, admin can see any profile.
   *
   * @param id {Number}
   */
  @ApiOperation({
    summary:
        'Get user by ID (admin can see any profile, regular user only their own)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Numeric ID of the user to retrieve',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User found. Password field is omitted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: missing or invalid token' })
  @ApiResponse({
    status: 403,
    description:
        'Forbidden: regular users can only access their own profile, admin can access any',
  })
  @ApiResponse({ status: 404, description: 'Not Found: user does not exist' })
  @UseGuards(JwtAuthGuard, AdminOrOwnerGuard)
  @Get(':id')
  async findOne(
      @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<PrismaUser, 'password'>> {
    return this.userService.findOne(id);
  }

  /**
   * Update user. User can edit only his profile, admin can edit any profile.
   *
   * @param id {Number}
   * @param updateUserDto {UpdateUserDto}
   */
  @ApiOperation({
    summary:
        'Update user by ID (admin can update any profile, regular user only their own)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Numeric ID of the user to update',
    required: true,
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully. Password field is omitted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: missing or invalid token' })
  @ApiResponse({
    status: 403,
    description:
        'Forbidden: regular users can only update their own profile, admin can update any',
  })
  @ApiResponse({ status: 404, description: 'Not Found: user does not exist' })
  @ApiResponse({ status: 409, description: 'Conflict: username or email already in use' })
  @UseGuards(JwtAuthGuard, AdminOrOwnerGuard)
  @Patch(':id')
  async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<PrismaUser, 'password'>> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Delete profile. User can delete only his profile, admin can delete any profile.
   *
   * @param id {Number}
   */
  @ApiOperation({
    summary:
        'Delete user by ID (admin can delete any profile, regular user only their own)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Numeric ID of the user to delete',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully. Password field is omitted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: missing or invalid token' })
  @ApiResponse({
    status: 403,
    description:
        'Forbidden: regular users can only delete their own profile, admin can delete any',
  })
  @ApiResponse({ status: 404, description: 'Not Found: user does not exist' })
  @UseGuards(JwtAuthGuard, AdminOrOwnerGuard)
  @Delete(':id')
  async delete(
      @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<PrismaUser, 'password'>> {
    return this.userService.delete(id);
  }
}
