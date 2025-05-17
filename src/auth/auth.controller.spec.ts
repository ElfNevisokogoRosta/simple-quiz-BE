import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDTO } from './auth.dto';
import { UserCreateDTO } from 'src/user/user.dto';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    mockAuthService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      // Optionally override AuthGuard globally for testing `@UseGuards`
      .overrideGuard(AuthGuard('jwt-refresh'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 1 }; // mock user payload
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access and refresh tokens', async () => {
      const dto: AuthDTO = { email: 'test@test.com', password: '1234' };
      const mockTokens = {
        access_token: 'access123',
        refresh_token: 'refresh123',
      };

      mockAuthService.signIn!.mockResolvedValue(mockTokens);

      const result = await controller.singIn(dto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('signUp', () => {
    it('should return tokens after registration', async () => {
      const dto: UserCreateDTO = {
        email: 'new@user.com',
        password: 'pass',
        name: 'User',
      };
      const mockTokens = {
        access_token: 'access456',
        refresh_token: 'refresh456',
      };

      mockAuthService.signUp!.mockResolvedValue(mockTokens);

      const result = await controller.signUp(dto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('refresh', () => {
    it('should return new tokens from refreshToken', async () => {
      const mockReq = { user: { id: 1 } };
      const mockTokens = {
        access_token: 'access789',
        refresh_token: 'refresh789',
      };

      mockAuthService.refreshToken!.mockResolvedValue(mockTokens);

      const result = await controller.refresh(mockReq);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(mockReq.user);
      expect(result).toEqual(mockTokens);
    });
  });
});
