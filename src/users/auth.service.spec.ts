import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      find: (email: string) => {
        const searchedUser = users.find((user) => user.email === email);
        return Promise.resolve(searchedUser);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('password should be hashed', async () => {
    const user = await service.signUp('boogie@woogie.com', 'booga');
    expect(user.password).not.toEqual('booga');
    expect(user.password).toContain('$2b$10$');
  });

  it('throws an error if user provides email to sign in that has not been used before', () => {
    expect(async () => {
      await service.signIn('foot@ball.com', 'football');
    }).rejects.toThrowError(UnauthorizedException);
  });

  it('provided password matches the stored password', async () => {
    await service.signUp('boogie@woogie.com', 'booga');
    const user = await service.signIn('boogie@woogie.com', 'booga');
    expect(user).toBeDefined();
  });

  it("throws an error if provided password doesn't match stored password", async () => {
    await service.signUp('boogie@woogie.com', 'booga');
    expect(async () => {
      await service.signIn('boogie@woogie.com', 'boogaaa');
    }).rejects.toThrowError(UnauthorizedException);
  });
});
