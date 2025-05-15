import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });
  }
}
