import { Injectable } from '@nestjs/common';

import * as fs from 'fs';

import { ImageService } from 'src/shared/modules/image/image.service';
import { PaginatedResultDto } from 'src/shared/schemas/pagination-result.dto';
import { PaginationDto } from 'src/shared/schemas/pagination.dto';
import generatePagination from 'src/shared/utils/generate-pagination';
import { Album } from '../albums/entities/album.entity';
import { AlbumRepository } from '../albums/repositories/album.repository';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { Photo } from './entities/photo.entity';
import { PhotoRepository } from './repositories/photo.repository';
import { GetUserPhotosDto } from './schemas/get-user-photos.dto';
import { SavePhotoDto } from './schemas/save-photo.dto';
import { UpdatePhotoDto } from './schemas/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly userRepository: UserRepository,
    private readonly imageService: ImageService,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async createPhoto(
    savePhotoDto: SavePhotoDto,
  ): Promise<Omit<Photo, 'url'> | string> {
    try {
      const { user, albumId } = savePhotoDto;
      const album: Album | undefined = albumId
        ? await this.albumRepository.findOne(albumId)
        : undefined;

      if (!user) {
        throw new Error('User with that id does not exists.');
      }

      return await this.photoRepository.createPhoto(savePhotoDto, user, album);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async updatePhoto(updatePhotoDto: UpdatePhotoDto): Promise<Photo | string> {
    try {
      const { albumId } = updatePhotoDto;
      const album: Album | undefined = albumId
        ? await this.albumRepository.findOne(albumId)
        : undefined;

      return await this.photoRepository.updatePhoto(updatePhotoDto, album);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async updatePhotoImage(
    photoId: string,
    file: Express.Multer.File,
  ): Promise<Photo | string> {
    try {
      const photo = await this.photoRepository.findOne({
        where: { id: photoId },
      });
      const imageUploaded = await this.imageService.uploadImage(file, 'photos');

      if (typeof imageUploaded === 'string') {
        throw new Error(imageUploaded);
      }

      photo.url = imageUploaded.Location;
      photo.image_key = imageUploaded.Key;
      await photo.save();
      fs.rm(file.path, undefined);
      return photo;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async deletePhoto(photoId: string): Promise<void | string> {
    try {
      const photo = await this.photoRepository.findOne({
        where: { id: photoId },
      });

      await this.imageService.deleteImage(photo.image_key);

      await photo.remove();
    } catch (error) {
      return (error as Error).message;
    }
  }

  async indexUserPhotos(
    user: User,
    getUserPhotosDto: PaginationDto,
  ): Promise<PaginatedResultDto<Photo> | string> {
    try {
      const { page, perPage } = getUserPhotosDto;

      if (!user) {
        throw new Error('User with that id does not exists.');
      }

      const photos = await this.photoRepository
        .find({
          relations: ['user', 'album'],
        })
        .then((r) => r.filter((photo) => photo.user.id === user.id));

      return generatePagination<Photo>(photos, page, perPage);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async indexAlbumPhotos(
    albumId: string,
    getAlbumPhotosDto: PaginationDto,
  ): Promise<PaginatedResultDto<Photo> | string> {
    try {
      const { page, perPage } = getAlbumPhotosDto;

      if (!albumId) {
        throw new Error('Album id is invalid.');
      }

      const photos = await this.photoRepository
        .find({
          relations: ['album', 'user'],
        })
        .then((r) => r.filter((photo) => photo.album.id === albumId));

      return generatePagination<Photo>(photos, page, perPage);
    } catch (error) {
      return (error as Error).message;
    }
  }

  async showPhotoById(photoId: string): Promise<Photo | string> {
    try {
      return await this.photoRepository.findOne(photoId, {
        relations: ['user', 'album'],
      });
    } catch (error) {
      return (error as Error).message;
    }
  }
}
