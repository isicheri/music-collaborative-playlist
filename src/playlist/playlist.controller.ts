import { Controller, Post,Body, Req, UseGuards, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, UpdatePlaylistDto, UpdatePlaylistType } from './Dto/playlist.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('playlist')
@UseGuards(AuthGuard)
export class PlaylistController {
constructor(private readonly playlistService:PlaylistService) {}

@Post("create-playlist")
async createPlaylist(
    @Body() body:CreatePlaylistDto,
    @Req() request:Request
) {
    return this.playlistService.createPlaylist(body,request);
}

@Post("update-playlist/:playlistId")
async updatePlaylistName(
    @Param("playlistId",new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) playlistId:number,
    @Body() body:UpdatePlaylistType 
) {
    const updatePlaylist:UpdatePlaylistDto = {playlistId: playlistId,name: body.name,desc: body.desc}
return this.playlistService.updatePlaylist(updatePlaylist)
}


}