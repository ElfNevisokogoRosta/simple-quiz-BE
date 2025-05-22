import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { UserCreateDTO, UserUpdateDTO } from './user.dto';
import { SearchParams, UpdateInfo } from 'src/common/types';

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

  async getAllUsers(search_params: SearchParams) {
    const users = await this.prisma.user.findMany({
      where: {
        ...(search_params.ids?.length ? { id: { in: search_params.ids } } : {}),
        ...(search_params.searchQ
          ? { name: { contains: search_params.searchQ, mode: 'insensitive' } }
          : {}),
      },
      skip: search_params.skip,
      take: search_params.take,
    });
    const count = await this.prisma.user.count();
    return { users, count };
  }

  async updateUser(updateUser: UpdateInfo<UserUpdateDTO>) {
    return await this.prisma.user.update({
      where: {
        id: updateUser.id,
      },
      data: updateUser.dto,
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
