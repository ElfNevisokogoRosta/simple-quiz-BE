import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Partial<Record<keyof UserRepository, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(() => {
    userRepo = {
      getUserByEmail: jest.fn(),
      createNewUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake_token'),
    };

    service = new AuthService(userRepo as any, jwtService as any);

    (service as any).JWTTTL = '1h';
    (service as any).RefreshTTL = '1d';
    (service as any).JWTSecret = 'secret';
    (service as any).RefreshSecret = 'refresh_secret';
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const user = { email: 'test@test.com', password: 'hashed', id: 1 };
      userRepo.getUserByEmail!.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser({
        email: 'test@test.com',
        password: 'pass',
      });
      expect(result).toEqual({ email: 'test@test.com', id: 1 });
    });

    it('should throw BadRequestException if user not found or password invalid', async () => {
      userRepo.getUserByEmail!.mockRejectedValue(new Error('not found'));
      await expect(
        service.validateUser({ email: 'a', password: 'b' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signUp', () => {
    it('should return tokens after successful user creation', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_pass' as never);
      userRepo.createNewUser!.mockResolvedValue({ id: 1 });

      const result = await service.signUp({
        email: 'test@test.com',
        password: 'pass',
        name: 'Test',
      });

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it('should throw ConflictException on failure', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      userRepo.createNewUser!.mockRejectedValue(new Error('conflict'));

      await expect(
        service.signUp({ email: 'e', password: 'p', name: 'n' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
