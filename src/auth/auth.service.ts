import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { LoginDto, RegisterDto } from './dto/auth.dto';
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
            username: registerDto.username,
        }
    })
    if(userExist) {
        throw new BadRequestException("this user already exists")
    }
    const hashedPassword = await bcrypt.hash(registerDto.password,10)
    const user = await this.prismaService.user.create({data: {...registerDto,password:hashedPassword}});
    return user
}

async login(loginDto: LoginDto) {
   
}

private async validateUser(loginDto: LoginDto) {
    const userExist = await this.prismaService.user.findUnique({
        where: {
            username: loginDto.username
        }
    })
    if(!userExist && !(await bcrypt.compare(loginDto.password,userExist.password))) {
        throw new BadRequestException("login credentials invalid")
    }
}

private async generateLoginToken(userId: number) {
const code = crypto.randomBytes(20).toString("hex").slice(-6).toUpperCase();
const _x_date = new Date();
const set_x_date = _x_date.setDate(_x_date.getMinutes() + 10); // this should be ten minutes
const loginToken = await this.prismaService.loginToken.create({
    data: {
        userId: userId,
        code: code,
        expireAt: set_x_date.toString(),
    }
})
return loginToken
}

async logoutUser() {} //working on the implementation

}