import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User as PrismaUser } from '../../generated/prisma';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier', // 'identifier' can be username or email
      passwordField: 'password',
    });
    this.logger.log('LocalStrategy initialized');
  }

  async validate(identifier: string, passwordInput: string): Promise<Omit<PrismaUser, 'password'>> {
    this.logger.log(`LocalStrategy validate: attempting to validate identifier=${identifier}`);
    const user = await this.authService.validateUserLocal(identifier, passwordInput);
    if (!user) {
      this.logger.warn(`LocalStrategy validate: User not found or password mismatch for identifier=${identifier}`);
      throw new UnauthorizedException('Invalid credentials from LocalStrategy');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user; // Don't return password hash
    this.logger.log(`LocalStrategy validate: User validated successfully, returning user ID: ${result.id}`);
    return result;
  }
} 