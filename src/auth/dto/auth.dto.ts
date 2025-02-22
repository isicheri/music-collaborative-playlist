import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";


export class RegisterDto {
    @IsNotEmpty({message: "email feild cannot be empty"})
    @IsEmail()
    @IsString()
    email:string

    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    username: string;

    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    password: string;
    
    @IsNotEmpty({message: "confirm password cannot be empty"})
    @IsString()
    confirmPassword: string;
}

export class LoginDto {
    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    username: string;

    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    password: string;

    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    @MaxLength(6)
    loginCode: string
}

export class UserLoginCodeDto {
    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    username: string; 
}

export type UserLoginCodeType = Pick<LoginDto,"username">;
export type payload = Pick<User, 'isValidated' | "username" | "id">;
