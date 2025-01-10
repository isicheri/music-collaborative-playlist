import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { RegisterDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
) {}

async register(registerDto:RegisterDto) {
    const userExist = await this.prismaService.user.findUnique({
        where: {
            username: registerDto.username
        }
    })
    if(userExist) {
        throw new BadRequestException("this user already exists")
    }
    const hashedPassword = await bcrypt.hash(registerDto.password,10)
    const user = await this.prismaService.user.create({data: {...registerDto,password:hashedPassword}});
    return user
}

async login() {}

private validateUser() {}

private generateToken() {}

}
