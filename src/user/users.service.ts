import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({id})
  }

  findOneBy(email: string): Promise<User | null> {
    return this.usersRepository.findOne({where: {email}})
  }

  async findAll(): Promise<User[]> {
    
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
