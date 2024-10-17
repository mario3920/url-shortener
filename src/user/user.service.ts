import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try{
      await this.userRepository.save(createUserDto)
    }catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException('Unexpected error occurred');
      }
    }
    
    return {message: "User created successfully"};
  }

  findByEmail(email:string) {
    return this.userRepository.findOne({where:{email:email}});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const urltoUpdate = await this.userRepository.update(id,updateUserDto)
  }

}
