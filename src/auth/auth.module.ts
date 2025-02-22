import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SendGridService } from 'src/sendgrid_service/sendgrid.service';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: "1h"}
  })],
  providers: [AuthService,PrismaService,JwtService,SendGridService],
  controllers: [AuthController]
})
export class AuthModule {}
