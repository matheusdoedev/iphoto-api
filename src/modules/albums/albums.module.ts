import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosModule } from '../photos/photos.module';

import { UsersModule } from '../users/users.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AlbumRepository } from './repositories/album.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumRepository]),
    UsersModule,
    PhotosModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [TypeOrmModule],
})
export class AlbumsModule {}
