import { Body, Controller, Param, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/api/register-user')
    async registerUser( 
        @Body() body: RegisterDto,
        @Res() response: Response
    ) {
        return this.authService.register(body,response);
    }


    @Post('/api/login/:login_token/')
    async loginUser(
        @Body() body: LoginDto,
        @Param("login_token") loginToken: string,
        @Query("l") l: string
    ) {
        console.log(l);
        return this.authService.login(body,loginToken)
    }
}
