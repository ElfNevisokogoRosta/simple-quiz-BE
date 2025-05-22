import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../db/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRE_IN },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    JwtService,
    PrismaService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
