import { Injectable } from '@nestjs/common';

import { UserRepository } from '../users/repositories/user.repository';
import { Album } from './entities/album.entity';
import { AlbumRepository } from './repositories/album.repository';
import { Photo } from '../photos/entities/photo.entity';
import { PhotoRepository } from '../photos/repositories/photo.repository';
import { UpdateAlbumDto } from './schemas/update-album.dto';
import { SaveAlbumDto } from './schemas/save-album.dto';
import { User } from '../users/entities/user.entity';
import generatePagination from '../../shared/utils/generate-pagination';
import { PaginationDto } from 'src/shared/schemas/pagination.dto';
import { PaginatedResultDto } from 'src/shared/schemas/pagination-result.dto';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly userRepository: UserRepository,
    private readonly photoRepository: PhotoRepository,
  ) {}

  async createAlbum(saveAlbumDto: SaveAlbumDto): Promise<Album | string> {
    try {
      const { user } = saveAlbumDto;

      if (!user) {
        throw new Error('User with that id does not exists.');
      }

      return await this.albumRepository.createAlbum(saveAlbumDto, user);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async showAlbumById(albumId: string): Promise<Album | string> {
    try {
      return await this.albumRepository.findOne(albumId, {
        relations: ['photos', 'user'],
      });
    } catch (error) {
      return (error as Error).message;
    }
  }

  async indexUserAlbums(
    user: User,
    getUserAlbums: PaginationDto,
  ): Promise<PaginatedResultDto<Album> | string> {
    try {
      const { page, perPage } = getUserAlbums;

      const albums = await this.albumRepository
        .find({
          relations: ['user', 'photos'],
        })
        .then((r) => r.filter((album) => album.user.id === user.id));

      return generatePagination<Album>(albums, page, perPage);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async indexAlbumPhotos(albumId: string): Promise<Photo[] | string> {
    try {
      return await this.photoRepository
        .find({ relations: ['user', 'album'] })
        .then((r) =>
          r.filter(
            (photo) => photo && photo.album && photo.album.id === albumId,
          ),
        );
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
