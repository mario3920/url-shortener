import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
    private readonly logger: Logger
  ) {}
  async create(createUserDto: CreateUserDto) {
    this.logger.log('Create User Service called');
    try{
      await this.userRepository.save(createUserDto)
    }catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        this.logger.error('User already exists with this Email');
        throw new ConflictException('Email already exists');
      } else {
        this.logger.error('Unexpected error occurred');
        throw new InternalServerErrorException('Unexpected error occurred');
      }
    }
    
    return {message: "User created successfully"};
  }

  findByEmail(email:string) {
    this.logger.log('Find User by Email Service called');
    return this.userRepository.findOne({where:{email:email}});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log('Update User Service called');
    const urltoUpdate = await this.userRepository.update(id, updateUserDto)
    return {message: "User updated successfully"};
  }

}
