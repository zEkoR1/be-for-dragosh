import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as PrismaUser } from '../../generated/prisma'; // Using Prisma's generated type
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    // @Inject(forwardRef(() => AuthService)) // For circular dependency if AuthService needs UserService for e.g. user validation by username/email during login
    // private readonly authService: AuthService, // This might be better placed in AuthServce directly calling UserService methods
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<PrismaUser, 'password'>> {
    const { username, email, password, names } = createUserDto;

    const existingUserByEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUserByUsername = await this.prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername) {
      throw new ConflictException('User with this username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          names,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user; // Exclude password from the returned object
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findAll(): Promise<Omit<PrismaUser, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: number): Promise<Omit<PrismaUser, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<PrismaUser, 'password'>> {
    const { password, ...dataToUpdate } = updateUserDto;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...dataToUpdate,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2025') { // Prisma error code for record not found
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async remove(id: number): Promise<Omit<PrismaUser, 'password'>> {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2025') { // Prisma error code for record not found
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Could not delete user');
    }
  }
} 