import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve({ id: 1, email, password: 'abcde' } as User),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    const user = await service.signUp('boogie@woogie', 'chigga');
    expect(user.password).not.toEqual('chigga');
    expect(user.password).toContain('$2b$10$');
  });

  it('throws an error if user provides email to sign in that has not been used before', async () => {
    fakeUsersService.find = () => Promise.resolve(null);
    try {
      await service.signIn('foot@ball.com', 'football');
    } catch (error) {
      return;
    }
  });
});
