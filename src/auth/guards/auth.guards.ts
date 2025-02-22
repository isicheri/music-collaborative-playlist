import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma_service/prisma.service";
import { payload } from "../dto/auth.dto";



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request:Request = ctx.getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            const userPayload = this.jwtService.verify(token,{secret: process.env.JWT_SECRET})
            request["user"] = userPayload
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true
    }


    private extractTokenFromHeader(request:Request) {
        const [type,token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" || "Basic" ? token : undefined;
    }

}