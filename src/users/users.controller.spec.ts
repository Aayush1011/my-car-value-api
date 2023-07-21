import { Test, TestingModule } from '@nestjs/testing';
import { hash, compare } from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      signUp: async (email: string, password: string) => {
        const hashedPassword = await hash(password, 10);
        return fakeUsersService.create(email, hashedPassword);
      },
      signIn: async (email: string, password: string) => {
        const user = await fakeUsersService.find(email);
        if (!user) {
          throw new UnauthorizedException('Provide valid email or password');
        }

        const passwordCheck = await compare(password, user.password);

        if (!passwordCheck) {
          throw new UnauthorizedException('Provide valid email or password');
        }
        return user;
      },
    };

    const users: User[] = [];
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve(users.find((user) => user.id === id));
      },
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
        return Promise.resolve(users.find((user) => user.email === email));
      },
      delete: (id: number) => {
        const [deletedUser] = users.filter((user) => user.id === id);
        return Promise.resolve(deletedUser);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find one user by id', async () => {
    const newUser = await fakeUsersService.create(
      'howdie@howdie.com',
      'howdie',
    );
    const user = await controller.findUser(newUser.id);
    expect(user).toBeDefined();
  });

  it('should delete one user by id', async () => {
    const newUser = await fakeUsersService.create(
      'howdie@howdie.com',
      'howdie',
    );
    const user = await controller.deleteUser(newUser.id);
    expect(user).toBeDefined();
  });

  it('throws an error when user id is not found', async () => {
    // const newUser = await fakeUsersService.create(
    //   'howdie@howdie.com',
    //   'howdie',
    // );
    expect(async () => {
      await controller.findUser(99);
    }).rejects.toThrowError(NotFoundException);
  });

  it('signs user up and updates session object', async () => {
    const session = { userId: null };
    const user = await controller.signUpUser(
      { email: 'wakka@wakka.com', password: 'wakka' },
      session,
    );
    expect(session.userId).not.toBeNull();
    expect(user).toBeDefined();
  });

  it('signs user in and updates session object', async () => {
    const session = { userId: null };
    await controller.signUpUser(
      { email: 'wakka@wakka.com', password: 'wakka' },
      session,
    );
    const user = await controller.signInUser(
      { email: 'wakka@wakka.com', password: 'wakka' },
      session,
    );
    expect(session.userId).not.toBeNull();
    expect(user).toBeDefined();
  });
});
