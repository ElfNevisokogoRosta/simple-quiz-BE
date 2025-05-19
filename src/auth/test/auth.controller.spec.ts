import { TestingModule, Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { randomUUID } from 'crypto';
import { AuthDTO } from '../auth.dto';
import { UserCreateDTO } from 'src/user/user.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const testCredentials: AuthDTO = {
    email: 'test@email.com',
    password: '123Qwe1',
  };
  const testSignUpCredential: UserCreateDTO = {
    email: 'test@email.com',
    password: '123Qwe1',
    name: 'Joe Doe',
  };

  const mockAuthService = {
    signUp: jest.fn((userDTO: UserCreateDTO) => {
      if (userDTO.email === testCredentials.email) {
        return Promise.reject('Conflict');
      }
      return Promise.resolve({
        access_token: randomUUID(),
        refresh_token: randomUUID(),
      });
    }),
    signIn: jest.fn((dto: AuthDTO) => {
      if (
        dto.email === testCredentials.email &&
        dto.password === testCredentials.password
      ) {
        return Promise.resolve({
          access_token: randomUUID(),
          refresh_token: randomUUID(),
        });
      }
      return Promise.reject('Invalid credentials');
    }),

    refreshToken: jest.fn((user: { isExpired: boolean }) => {
      if (user.isExpired) {
        return Promise.reject('Token Exipred');
      }
      return Promise.resolve({
        access_token: randomUUID(),
        refresh_token: randomUUID(),
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new user', () => {
    expect(
      controller.signUp({
        email: 'newEmail@test.com',
        name: 'Jhon Dou',
        password: 'QWErty123',
      }),
    ).resolves.toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('should throw conflict', () => {
    expect(controller.signUp(testSignUpCredential)).rejects.toEqual('Conflict');
  });

  it('should sign in a user', () => {
    expect(
      controller.signIn({
        email: 'test@email.com',
        password: '123Qwe1',
      }),
    ).resolves.toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('should reject user with invalid credential', () => {
    expect(
      controller.signIn({
        email: 'wrong@email.com',
        password: 'wrong',
      }),
    ).rejects.toEqual('Invalid credentials');
  });

  it('should refresh auth tokens', () => {
    const mockRequest = { user: { isExpired: false } };
    expect(controller.refresh(mockRequest)).resolves.toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('should reject expired refresh token', () => {
    const mockRequest = { user: { isExpired: true } };
    expect(controller.refresh(mockRequest)).rejects.toEqual('Token Exipred');
  });
});
