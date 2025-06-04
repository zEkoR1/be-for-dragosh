import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  forwardRef,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as PrismaUser } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
/**
 * Service providing CRUD operations for User entities.
 */
@Injectable()
export class UserService {
  constructor(
      private readonly prisma: PrismaService,
  ) {}

  /**
   * Creates a new user in the database.
   *
   * @param createUserDto {CreateUserDto}
   *
   * @returns A Promise resolving to the created user object without the password field.
   * @throws ConflictException if a user with the same email or username already exists.
   * @throws InternalServerErrorException if any other error occurs during creation.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<PrismaUser, 'password'>> {
    const { username, email, password, names, isAdmin } = createUserDto;

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
          isAdmin
        },
      });
      // Exclude password from the returned object
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns A Promise resolving to an array of user objects without their password fields.
   */
  async findAll(): Promise<Omit<PrismaUser, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  /**
   * Retrieves a single user by their unique ID.
   *
   * @param id - Numeric ID of the user to retrieve.
   * @returns A Promise resolving to the user object without the password field.
   * @throws NotFoundException if no user with the given ID exists.
   */
  async findOne(id: number): Promise<Omit<PrismaUser, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  /**
   * Retrieves a user by their unique username.
   *
   * @param username - The username to search for.
   * @returns A Promise resolving to the full PrismaUser object or null if not found.
   */
  async findByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  /**
   * Retrieves a user by their unique email.
   *
   * @param email - The email address to search for.
   * @returns A Promise resolving to the full PrismaUser object or null if not found.
   */
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Updates an existing user.
   *
   * @param id - Numeric ID of the user to update.
   * @param updateUserDto - Data transfer object containing fields to update:
   *   - password: optional plaintext password (will be hashed if provided)
   *   - other fields (e.g., email, username, names, isAdmin)
   * @returns A Promise resolving to the updated user object without the password field.
   * @throws NotFoundException if no user with the given ID exists.
   * @throws InternalServerErrorException if any other error occurs during update.
   */
  async update(
      id: number,
      updateUserDto: UpdateUserDto
  ): Promise<Omit<PrismaUser, 'password'>> {
    const { username, email, password, ...otherFields } = updateUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (username && username !== existingUser.username) {
      const userWithSameUsername = await this.prisma.user.findUnique({
        where: { username },
      });
      if (userWithSameUsername) {
        throw new ConflictException(`Username "${username}" is already in use`);
      }
    }

    // 3. If updating email, ensure it’s not taken by someone else
    if (email && email !== existingUser.email) {
      const userWithSameEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (userWithSameEmail) {
        throw new ConflictException(`Email "${email}" is already in use`);
      }
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...(username && { username }),
          ...(email && { email }),
          ...(hashedPassword && { password: hashedPassword }),
          ...otherFields,
        },
      });
      const { password: _, ...result } = updatedUser;
      return result;
    } catch (error: any) {
      throw new BadRequestException();
    }
  }


  /**
   * Deletes a user by their unique ID.
   *
   * @param id - Numeric ID of the user to delete.
   * @returns A Promise resolving to the deleted user object without the password field.
   * @throws NotFoundException if no user with the given ID exists.
   * @throws InternalServerErrorException if any other error occurs during deletion.
   */
  async delete(id: number): Promise<Omit<PrismaUser, 'password'>> {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      const { password, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Could not delete user');
    }
  }
}
