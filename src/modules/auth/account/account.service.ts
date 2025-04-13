import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {

    public constructor(private readonly prismaService: PrismaService) {}

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }


    public async findAll() {
        const users = await this.prismaService.user.findMany()

        return users
    }
        
    public async create(input: CreateUserInput) {
        const {username, email, password} = input

        const isUsernameExist = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if (isUsernameExist) {
            throw new ConflictException('Это имя пользователя уже занято')
        }

        const isEmailExist = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (isEmailExist) {
            throw new ConflictException('Эта почта уже занята')
        }

        const user = await this.prismaService.user.create({
            data: {
                username, 
                email, 
                password: await hash(password),
                displayName: username
            }
        })

        return true
    }
}
