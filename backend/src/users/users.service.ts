import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email or username already exists
    const existingUser = await this.usersRepository.findOne({ 
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username }
      ]
    });
    
    if (existingUser) {
      throw new ConflictException(
        existingUser.email === createUserDto.email
          ? 'Email already in use'
          : 'Username already taken'
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Create new user
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // If updating email or username, check for conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }
    
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const usernameExists = await this.usersRepository.findOne({ 
        where: { username: updateUserDto.username } 
      });
      if (usernameExists) {
        throw new ConflictException('Username already taken');
      }
    }
    
    // Handle password update separately
    if (updateUserDto.newPassword) {
      user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
      delete updateUserDto.newPassword;
    }
    
    // Update other fields
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
