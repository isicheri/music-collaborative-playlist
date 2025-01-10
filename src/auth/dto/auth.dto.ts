import { IsNotEmpty, IsString, length, min } from "class-validator";


export class RegisterDto {
    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    username: string;

    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    password: string;

}

export class LoginDto {
    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    username: string;

    @IsString()
    @IsNotEmpty({message: "feild cannot be empty"})
    password: string;
}