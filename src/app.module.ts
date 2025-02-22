import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({imports: [AuthModule, PlaylistModule]})
export class AppModule {}
