import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/db/prisma.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository],
})
export class UserModule {}
