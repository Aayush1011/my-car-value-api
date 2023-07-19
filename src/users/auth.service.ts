import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const hashedPassword = await hash(password, 10);
    return this.usersService.create(email, hashedPassword);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.find(email);

    if (!user) {
      throw new UnauthorizedException('Provide valid email or password');
    }

    const passwordCheck = await compare(password, user.password);

    if (!passwordCheck) {
      throw new UnauthorizedException('Provide valid email or password');
    }
    return user;
  }
}
