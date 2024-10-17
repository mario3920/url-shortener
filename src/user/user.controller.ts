import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorators';
import { jwtDecodeGetId } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try{
      return this.userService.create(createUserDto);
    }catch (error) {
      throw new Error(error)
    }
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Headers() headers:Record<string, string>,) {
    try{
      const userId:string = await jwtDecodeGetId(this.jwtService,headers.authorization)
      return this.userService.update(+userId, updateUserDto);
    }catch (error) {
      throw new Error(error)
    }
  }
}
