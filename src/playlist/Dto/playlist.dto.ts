import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class CreatePlaylistDto {
@IsString()
@IsNotEmpty()
name:string;

@IsString()
@IsNotEmpty()
desc:string

}

export class UpdatePlaylistDto {
   
    @IsNumber()
    @IsNotEmpty()
    playlistId: number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    desc:string
}

export type UpdatePlaylistType = Omit<UpdatePlaylistDto,"playlistId">