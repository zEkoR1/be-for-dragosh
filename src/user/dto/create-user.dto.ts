import {IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsBoolean} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {Prisma} from "../../../generated/prisma";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({type: String, example: 'username' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({type: String, example: 'email@email.com' })
  email: string;

  @ApiProperty({ type: String, example: 'strongpassword' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50) // Align with Go model validation, though DB stores hash
  password: string;

  @ApiProperty({ required: false, type: String, example: 'name' })
  @IsOptional()
  @IsString()
  names?: string;


  @ApiProperty({type: Boolean,  example: true })
  @IsBoolean()
  isAdmin: boolean
}
