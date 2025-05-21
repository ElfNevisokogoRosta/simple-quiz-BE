import { UserRepository } from '../../user/user.repository';
import { AuthService } from '../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserCreateDTO } from '../../user/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const hashedPassword = bcrypt.hashSync('Qwerty123!', 10);

  const userMockValue: User = {
    id: '71ef2bf8-1f63-4641-afcc-e36f307770ec',
    email: 'some@test.email',
    createdAt: new Date(),
    name: 'Joe Doe',
    password: hashedPassword,
    updatedAt: new Date(),
  };
  const { password, ...userWithOutPassword } = userMockValue;

  const mockUserRepository: UserRepository = {
    getUserByEmail: jest.fn((email: string) => {
      const isExist = email == userMockValue.email;
      if (isExist) {
        return Promise.resolve(userMockValue);
      }
      return Promise.reject(new Error('Not found'));
    }),
    createNewUser: jest.fn((userCreateDTO: UserCreateDTO) => {
      if (userCreateDTO.email === userMockValue.email) {
        return Promise.reject(new ConflictException('Conflict'));
      }
      return Promise.resolve({
        createdAt: new Date(),
        email: userCreateDTO.email,
        id: '3e41b875-02f8-4341-b3cb-ba97f2586fd7',
        name: userCreateDTO.name,
        password: hashedPassword,
        updatedAt: new Date(),
      });
    }),
  } as unknown as UserRepository;

  const mockJwtService: JwtService = {
    sign: jest.fn((payload: any) => {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
    }),
  } as Partial<JwtService> as JwtService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, JwtService, AuthService],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    service = testingModule.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', () => {
    expect(
      service.validateUser({
        email: 'some@test.email',
        password: 'Qwerty123!',
      }),
    ).resolves.toEqual(userWithOutPassword);
  });
  it('should reject due to email &/ password reason', () => {
    expect(
      service.validateUser({
        email: 'wrong@test.email',
        password: 'not-correct-password',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should sign in user', () => {
    expect(
      service.signIn({
        email: 'some@test.email',
        password: 'Qwerty123!',
      }),
    ).resolves.toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('should reject user sign in process', () => {
    expect(
      service.signIn({
        email: 'wrong@test.email',
        password: 'not-correct-password',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create new user & return tokens', () => {
    expect(
      service.signUp({
        email: 'newTest@email.com',
        password: 'SomeTestPassword',
        name: 'Doe Joe',
      }),
    ).resolves.toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('should reject user creation due to conflict error', () => {
    expect(
      service.signUp({
        email: 'some@test.email',
        password: 'Qwerty123!',
        name: 'Joe Doe',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
