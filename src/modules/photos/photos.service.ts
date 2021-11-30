import { Injectable } from '@nestjs/common';

import * as fs from 'fs';

import { ImageService } from 'src/shared/modules/image/image.service';
import { UserRepository } from '../users/repositories/user.repository';
import { Photo } from './entities/photo.entity';
import { PhotoRepository } from './repositories/photo.repository';
import { SavePhotoDto } from './schemas/save-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly userRepository: UserRepository,
    private readonly imageService: ImageService,
  ) {}

  async createPhoto(
    savePhotoDto: SavePhotoDto,
  ): Promise<Omit<Photo, 'url'> | string> {
    try {
      const { userId } = savePhotoDto;
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error('User with that id does not exists.');
      }

      return await this.photoRepository.createPhoto(savePhotoDto, user);
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

  async indexUserPhotos(userId: string): Promise<Photo[] | string> {
    try {
      const checkIfUserExists = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!checkIfUserExists) {
        throw new Error('User with that id does not exists.');
      }

      return await this.photoRepository
        .find({
          relations: ['user'],
        })
        .then((r) => r.filter((photo) => photo.user.id === userId));
    } catch (error) {
      return (error as Error).message;
    }
  }
}
