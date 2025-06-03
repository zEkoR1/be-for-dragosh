import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test21', description: 'Username or Email' })
  @IsString()
  identity: string;

  @ApiProperty({ example: 'testtest', description: 'Password' })
  @IsString()
  password: string;
}
