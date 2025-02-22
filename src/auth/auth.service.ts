import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import {randomBytes} from "node:crypto";
import { LoginDto, payload, RegisterDto, UserLoginCodeType } from './dto/auth.dto';
import { Request, Response } from 'express';
import { SendGridService } from 'src/sendgrid_service/sendgrid.service';

@Injectable()
export class AuthService {
constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sendgridService: SendGridService
) {}

async register(registerDto:RegisterDto,response: Response) {
      try {
        const userExist = await this.prismaService.user.findUnique({where: {username: registerDto.username,}})
        if(userExist) {throw new BadRequestException("this user already exists")}
        type filteredUser = Pick<RegisterDto, "username" | "password">;
        const registerUser:filteredUser= {username: registerDto.username,password: registerDto.password};
        const hashedPassword = await bcrypt.hash(registerUser.password,10)
        const code = randomBytes(20).toString("hex").slice(-6).toUpperCase();
        const _x_date = new Date();
        const expireAt = new Date(_x_date).getTime() + 5 * 60 * 1000; 
       return  await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({data: {...registerUser,password: hashedPassword}})
        const loginToken = await tx.loginToken.create({ data: {code: code,userId: user.id,expireAt: `${expireAt}
`}})
     response.json({success: true,data: {username:user.username,logincode: loginToken.code}})
      });
      } catch (error) {
        throw new BadRequestException("something went wrong!")
      }
}

async login(loginDto: LoginDto) {
  return await this.validateUser(loginDto);
}

 async requestNewLoginCode(userLoginCodeDto: UserLoginCodeType) {
    const userExist = await this.prismaService.user.findUnique({where: {username: userLoginCodeDto.username},include: {logintoken: true}});
    if(userExist.logintoken.length === 1) {throw new BadRequestException("login has already been generated for you")}
    if(userExist) {
    const code = randomBytes(20).toString("hex").slice(-6).toUpperCase();
    const _x_date = new Date();
    const set_x_date = _x_date.setMinutes(_x_date.getMinutes() + 10);
        await this.prismaService.loginToken.create({
         data: {
             userId: (userExist).id,
             expireAt: set_x_date.toString(),
             code: code
         }
        })
        return {success: true,data: {username: (userExist).username,code: code}}
    }else {
    throw new BadRequestException("user cannot carry out this operation");
    }
}

private async validateUser(loginDto: LoginDto) {
    const userExist = await this.prismaService.user.findUnique({where: {username: loginDto.username},include: {logintoken: true}});
    if(!userExist) {throw new BadRequestException("user does not exist")}
    else {
        const comparedPassword = bcrypt.compareSync(loginDto.password,userExist.password)
        if(!comparedPassword) {
         throw new BadRequestException("password is incorrect")
        }
        if(userExist.logintoken.length === 0) {throw new BadRequestException("request for a new login code")}
        if(userExist.logintoken[0].code === loginDto.loginCode) {
            let parsed_x_date_minutes = new Date(parseInt(userExist.logintoken[0].expireAt.toString()));
            if(new Date().getTime() <=  parsed_x_date_minutes.getTime()) {
            await this.prismaService.user.update({
                where: {id: userExist.id},
                data: {
                    isValidated: true
                }
            })
             let customPayload: payload = {
                isValidated: true,
                id: userExist.id,
                username: userExist.username
             };
           const accessToken = this.jwtService.sign(customPayload,{secret: process.env.JWT_SECRET});
            await this.prismaService.loginToken.delete({
                where: {
                    id: userExist.logintoken[0].id,
                    userId: userExist.id
                }
            })
            return {accessToken}
        }else {
            await this.prismaService.loginToken.delete({
                where: {
                    id: userExist.logintoken[0].id,
                    userId: userExist.id
                }
            })
            throw new BadRequestException("login code expired!,request for a new one");
        }}else {
            await this.prismaService.loginToken.delete({
                where: {
                    id: userExist.logintoken[0].id,
                    userId: userExist.id
                }
            })
            throw new BadRequestException("login code is invalid! request for a new one");
        }
    }
}

async logoutUser(request:Request,response:Response) {
try {
    const {id}= request.user;
const userExist = await this.prismaService.user.findUnique({where: {id: id}});
request.headers.authorization = "";
if(!userExist) throw new NotFoundException();
 await this.prismaService.user.update({where: {id: userExist.id},data: {isValidated: false}})
 response.json({success: true,msg: "user successfully logged out true"})
} catch (error) {
    throw new BadRequestException()
}
} 

}