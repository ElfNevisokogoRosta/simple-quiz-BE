import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma:PrismaService){}

    async createUser(userData:any){
        try {
            return this.prisma.user.create({
                data: {...userData}
            })
        } catch (error) {
            
        }
    }
}
