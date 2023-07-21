import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CustomEmailValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validate(value: string): Promise<boolean> {
    const userWithEmail = await this.userRepository.findOneBy({ email: value });
    if (userWithEmail) {
      throw new BadRequestException(
        'Provided email address is already in use!',
      );
    } else {
      return true;
    }
  }
}
