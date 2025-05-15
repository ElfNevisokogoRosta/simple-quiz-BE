import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
      return new BadRequestException('Invalid credential');
    }
  }

  async signIn(){}
}
