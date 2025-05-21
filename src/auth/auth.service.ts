import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDTO } from './auth.dto';
import { JwtPayload } from './auth.types';
import { UserCreateDTO } from 'src/user/user.dto';
import { User } from '@prisma/client';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  private readonly JWTTTL: string;
  private readonly RefreshTTL: string;
  private readonly JWTSecret: string;
  private readonly RefreshSecret: string;

  constructor(
    private readonly user: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    this.JWTTTL = process.env.EXPIRE_IN || '';
    this.RefreshTTL = process.env.REFRESH_EXPIRE_IN || '';
    this.JWTSecret = process.env.JWT_SECRET || '';
    this.RefreshSecret = process.env.JWT_SECRET_REFRESH || '';
  }

  async validateUser({ email, password }) {
    try {
      const userData = await this.user.getUserByEmail(email);
      if (userData && (await bcrypt.compare(password, userData.password))) {
        const { password, ...results } = userData;
        return results;
      }
    } catch (error) {
      throw new BadRequestException('Invalid credential');
    }
  }

  async signIn(authDTO: AuthDTO) {
    const userData = await this.validateUser(authDTO);

    if (!userData) return null;

    const payload: JwtPayload = {
      id: userData.id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.JWTTTL,
        secret: this.JWTSecret,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.RefreshTTL,
        secret: this.RefreshSecret,
      }),
    };
  }

  async signUp(userCreateDTO: UserCreateDTO) {
    try {
      const hashPass = await bcrypt.hash(userCreateDTO.password, 10);

      const newUser = await this.user.createNewUser({
        ...userCreateDTO,
        password: hashPass,
      });

      const payload: JwtPayload = {
        id: newUser.id,
      };
      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: this.JWTTTL,
          secret: this.JWTSecret,
        }),
        refresh_token: this.jwtService.sign(payload, {
          expiresIn: this.RefreshTTL,
          secret: this.RefreshSecret,
        }),
      };
    } catch (error) {
      throw new ConflictException('Conflict');
    }
  }

  async refreshToken(userPayload: Partial<User>) {
    const payload: JwtPayload = {
      id: userPayload.id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.JWTTTL,
        secret: this.JWTSecret,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.RefreshTTL,
        secret: this.RefreshSecret,
      }),
    };
  }
}
