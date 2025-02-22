import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './Dto/playlist.dto';
import { Request } from 'express';

@Injectable()
export class PlaylistService {
    constructor(private readonly prismaService:PrismaService) {}

    async createPlaylist(createPlaylistDto:CreatePlaylistDto,request:Request) {
     const playlistListExist = await this.prismaService.playlist.findUnique({where: {name: createPlaylistDto.name}})
     if(playlistListExist) throw new BadRequestException("playlist with that name already exist");
     const playlist = await this.prismaService.playlist.create({
        data: {name: createPlaylistDto.name,desc: createPlaylistDto.desc,userId:request.user.id}
     })
    await this.prismaService.user.update({where: {id: request.user.id},
    data: {
        ownedPlaylists: {
            connect: {
                name: createPlaylistDto.name,
                desc: createPlaylistDto.desc
            }
        }
    }})
     return playlist;
    }

    async updatePlaylist(updatePlaylistDto:UpdatePlaylistDto) {
        const playlistExist = await this.prismaService.playlist.findUnique({where: {id: updatePlaylistDto.playlistId}})
        if(playlistExist) {
        const playlist = await this.prismaService.playlist.update({
            where: {name: playlistExist.name},
            data: {
                name: updatePlaylistDto.name,
                ...updatePlaylistDto
            }
        })
        }else {
            throw new BadRequestException()
        }
    }

    async deletePlaylist(playlistId:number,request:Request) {
     try {
        const playlist = await this.prismaService.playlist.delete({where: {id: playlistId,userId:request.user.id}});
        return "playlist deleted successfully" 
     } catch (error) {
        throw new  BadRequestException()
     }
    }

    async addCollaboratorsToPlaylist() {}

    async addSongToPlaylist() {}

    async deleteSongFromPlaylist() {}

    async addReviewToPlaylist() {}

    async deleteReviewForPlaylist() {}

    async addLikeToPlaylist() {}

    async deleteLikeForPLaylist() {}

    async getAllPlaylistSong() {}

    async getAllPlaylistLike() {}

    async getPlaylist() {}

    async getAllPlaylistReview() {}
}
