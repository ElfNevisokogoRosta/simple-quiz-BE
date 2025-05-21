import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { UserCreateDTO } from './user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createNewUser(userCreateDTO: UserCreateDTO) {
    return await this.prisma.user.create({
      data: userCreateDTO,
    });
  }
}
