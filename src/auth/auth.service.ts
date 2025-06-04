import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private config: ConfigService,
  ) {}

  async login(identity: string, password: string, res: Response) {
    console.log(identity)
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identity }, { username: identity }]
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign(
        { userId: user.id,
          isAdmin: user.isAdmin},
        { expiresIn: '1m' },

    );    const refreshToken = randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt }
    });

    this.setCookies(res, accessToken, refreshToken, expiresAt);
    return { message: 'Login successful', user: { id: user.id, username: user.username, isAdmin: user.isAdmin } };
  }

  async refreshTokens(token: string, res: Response) {
    if (!token) throw new UnauthorizedException('No refresh token');

    const record = await this.prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.delete({ where: { id: record.id } });

    const newAccess = this.jwtService.sign({ userId: record.user.id });
    const newRefresh = randomBytes(64).toString('hex');
    const newExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { token: newRefresh, userId: record.user.id, expiresAt: newExpires }
    });

    this.setCookies(res, newAccess, newRefresh, newExpires);
    return { message: 'Tokens refreshed' };
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string, refreshExpires: Date) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      maxAge: 3600 * 1000
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      expires: refreshExpires
    });
  }
  async validateUserLocal(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
