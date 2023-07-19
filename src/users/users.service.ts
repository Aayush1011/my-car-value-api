import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const newUser = this.userRepository.create({ email, password });
    return this.userRepository.save(newUser);
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findAll() {
    return this.userRepository.find();
  }

  async update(id: number, attributes: { email?: string; password?: string }) {
    const userToUpdate = await this.findOne(id);
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    Object.assign(userToUpdate, attributes);
    return this.userRepository.save(userToUpdate);
  }

  async delete(id: number) {
    const userToDelete = await this.findOne(id);
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(userToDelete);
  }
}
