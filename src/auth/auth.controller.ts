import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
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


    @Post('/api/login/:login_token/l=true')
    async loginUser() {}
}
