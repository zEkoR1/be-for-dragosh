import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'test21' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'test1@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'testtest' })
    @IsString()
    password: string;
}
