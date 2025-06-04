import {
  Controller, Post, Body, Res, Req, UseGuards, Get, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *  Login
   *
   * @param body {LoginDto}
   * @param res
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with username/email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
      @Body() body: LoginDto,
      @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(body.identity, body.password, res);
  }

  /**
   * Logout
   *
   * @param res
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout the current user' })
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  /**
   * Refreshed token
   *
   * @param req
   * @param res
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token;
    return this.authService.refreshTokens(token, res);
  }

  /**
   * Returns profile
   *
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile (requires JWT)' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
