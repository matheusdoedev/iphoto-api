import { Injectable } from '@nestjs/common';

import { SavePhotoDto } from '../photos/schemas/save-photo.dto';
import { UserRepository } from '../users/repositories/user.repository';
import { Album } from './entities/album.entity';
import { AlbumRepository } from './repositories/album.repository';
import { UpdateAlbumDto } from './schemas/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createAlbum(saveAlbumDto: SavePhotoDto): Promise<Album | string> {
    try {
      const { userId } = saveAlbumDto;
      const user = await this.userRepository.findOne(userId);

      if (!user) {
        throw new Error('User with that id does not exists.');
      }

      return await this.albumRepository.createAlbum(saveAlbumDto, user);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async indexUserAlbums(userId: string): Promise<Album[] | string> {
    try {
      return await this.albumRepository
        .find({
          relations: ['user', 'photos'],
        })
        .then((r) => r.filter((album) => album.user.id === userId));
    } catch (error) {
      return (error as Error).message;
    }
  }

  async updateAlbum(updateAlbumDto: UpdateAlbumDto): Promise<Album | string> {
    try {
      const { albumId, title } = updateAlbumDto;
      const album = await this.albumRepository.findOne(albumId);

      album.title = title;

      await album.save();
      return album;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async removeAlbum(albumId: string): Promise<void | string> {
    try {
      const album = await this.albumRepository.findOne(albumId);

      await album.remove();
    } catch (error) {
      return (error as Error).message;
    }
  }
}
