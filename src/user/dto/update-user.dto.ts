import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  
  @ApiPropertyOptional({ description: 'User name'})
  @IsNotEmpty({message: "Name cannot be empty"})
  name: string

  @ApiPropertyOptional({ description: 'User email'})
  @IsEmail(undefined, { message: "the provided email is invalid" })
  email: string

  @ApiPropertyOptional({ description: 'User password'})
  @IsNotEmpty()
  @MinLength(6, { message: 'the password need at least 6 characters' })
  password: string

}
