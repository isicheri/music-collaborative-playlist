import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
) {}

async register(registerDto:RegisterDto,response: Response) {
    const userExist = await this.prismaService.user.findUnique({
        where: {
            username: registerDto.username,
        }
    })
    if(userExist) {
        throw new BadRequestException("this user already exists")
    }
    const hashedPassword = await bcrypt.hash(registerDto.password,10)
    const code = crypto.randomBytes(20).toString("hex").slice(-6).toUpperCase();
const _x_date = new Date();
const set_x_date = _x_date.setMinutes(_x_date.getMinutes() + 10);
   const [user,loginToken] = await this.prismaService.$transaction([
    this.prismaService.user.create({
    data: {
        ...registerDto,
        password: hashedPassword
    }
    }),
    this.prismaService.loginToken.create({
        data: {
            userId: userExist.id,
            code: code,
            expireAt: set_x_date.toString(),
        }
    })
   ])
    response.json({
        data: {
            link: "",//later feature create a better feature to validate by send a link
            user: {name : user.username},
            code: loginToken.code
        }
    })
}

async login(loginDto: LoginDto,login_code:string) {
   let validateUser = await this.validateUser(loginDto,login_code);
   if(!validateUser) {
    return this.generate_new_login_code(loginDto)
   throw new BadRequestException(validateUser);
   }else {
    return {validateUser};
   }
}

private async generate_new_login_code(loginDto: LoginDto) {
    const userExist = this.prismaService.user.findUnique({where: {username: loginDto.username}});
    if(userExist) {
    const code = crypto.randomBytes(20).toString("hex").slice(-6).toUpperCase();
    const _x_date = new Date();
    const set_x_date = _x_date.setMinutes(_x_date.getMinutes() + 10);
        await this.prismaService.loginToken.create({
         data: {
             userId: (await userExist).id,
             expireAt: set_x_date.toString(),
             code: code
         }
        })
        return {sucess: true,code: code,link: ""}
    }else {
    throw new BadRequestException("user cannot carry out this operation");
    }
}

private async validateUser(loginDto: LoginDto,loginCode_x: string) {
    const userExist = await this.prismaService.user.findUnique({
        where: {
            username: loginDto.username
        },
       include: {logintoken: true}
    })
    if(!userExist && !(await bcrypt.compare(loginDto.password,userExist.password))) {
        throw new BadRequestException("login credentials invalid")
    }
    // first we have to the isValidated property to true the generate a check if the login token is not expired the generate a jwt token for the user
    // ill run another transaction
    if(userExist.logintoken[0].code === loginCode_x) {
        let parsed_x_date_minutes = new Date(parseInt(userExist.logintoken[0].expireAt.toString()));
        //working on the time it will expire
        if(parsed_x_date_minutes.getMinutes() === new Date().getMinutes()) {
        await this.prismaService.user.update({
            where: {id: userExist.id},
            data: {
                isValidated: true
            }
        })
        type payload = Pick<User, 'isValidated' | "username" | "id">;
         let customPayload: payload;
       const accessToken = this.jwtService.sign(customPayload,{secret: process.env.JWT_SECRET});
        await this.prismaService.loginToken.delete({
            where: {
                id: userExist.logintoken[0].id,
                userId: userExist.id
            }
        })
       return {accessToken,customPayload}
    }else {
        await this.prismaService.loginToken.delete({
            where: {
                id: userExist.logintoken[0].id,
                userId: userExist.id
            }
        })
        throw new BadRequestException("login code expired");
    }}else {
        await this.prismaService.loginToken.delete({
            where: {
                id: userExist.logintoken[0].id,
                userId: userExist.id
            }
        })
        throw new BadRequestException("login code is invalid");
    }
}

async logoutUser() {} //working on the implementation

}