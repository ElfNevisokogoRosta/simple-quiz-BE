import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { prismaErrorHandling } from 'src/common/helpers';
import { UserUpdateDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly user: UserRepository) {}

  async getAll(skip: number, take: number, ids?: string[], searchQ?: string) {
    try {
      return await this.user.getAllUsers({ ids, searchQ, skip, take });
    } catch (error) {
      prismaErrorHandling(error);
    }
  }

  async update(id: string, data: UserUpdateDTO) {
    try {
      return await this.user.updateUser({ id, dto: data });
    } catch (error) {
      prismaErrorHandling(error);
    }
  }

  async delete(id: string) {
    try {
      return await this.user.deleteUser(id);
    } catch (error) {
      prismaErrorHandling(error);
    }
  }
}
