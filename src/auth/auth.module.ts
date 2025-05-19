import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../db/prisma.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtService, PrismaService],
})
export class AuthModule {}
