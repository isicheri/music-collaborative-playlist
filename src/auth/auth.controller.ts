import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UserLoginCodeDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guards';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}


    @HttpCode(HttpStatus.CREATED)
    @Post('/api/register-user')
    async registerUser( 
        @Body() body: RegisterDto,
        @Res() response: Response
    ) {
        if(body.password !== body.confirmPassword) {
            throw new BadRequestException("password and confirmPassword does not match")
        }
        return this.authService.register(body,response);
    }

   @HttpCode(HttpStatus.OK)
    @Post('/api/login-user')
    async loginUser(
        @Body() body: LoginDto,
    ) {
        return this.authService.login(body)
    }

    @HttpCode(HttpStatus.OK)
    @Post("/api/request-code")
    async requestLoginCode(
        @Body() body: UserLoginCodeDto
    ) {
        return this.authService.requestNewLoginCode(body)
    }

    @HttpCode(HttpStatus.OK)
    @Post('/api/logout-user')
    async logoutUser(
        @Req() request:Request,
        @Res() response: Response
    ) {
      return this.authService.logoutUser(request,response)
    }

    @UseGuards(AuthGuard)
    @Get("/api/user-profile")
    getProfile(
        @Req() request:Request
    ) {
        return request.user
    }

}
