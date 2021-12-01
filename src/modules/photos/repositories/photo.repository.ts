import { EntityRepository, Repository } from 'typeorm';

import { Photo } from '../entities/photo.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SavePhotoDto } from '../schemas/save-photo.dto';
import { Album } from 'src/modules/albums/entities/album.entity';
import { UpdatePhotoDto } from '../schemas/update-photo.dto';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {
  async createPhoto(
    savePhotoDto: SavePhotoDto,
    user: User,
    album?: Album,
  ): Promise<Omit<Photo, 'url'> | string> {
    try {
      const { title } = savePhotoDto;
      const photo = this.create();

      photo.title = title;
      photo.user = user;
      if (album !== undefined) {
        photo.album = album;
      }

      await photo.save();
      return photo;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async updatePhoto(
    updatePhotoDto: UpdatePhotoDto,
    album?: Album,
  ): Promise<Photo | string> {
    try {
      const { title, photoId } = updatePhotoDto;
      const photo = await this.findOne(photoId);

      photo.title = title;
      photo.album = album;

      await photo.save();
      return photo;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
