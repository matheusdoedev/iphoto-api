import { EntityRepository, Repository } from 'typeorm';

import { Photo } from '../entities/photo.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SavePhotoDto } from '../schemas/save-photo.dto';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {
  async createPhoto(
    savePhotoDto: SavePhotoDto,
    user: User,
  ): Promise<Omit<Photo, 'url'> | string> {
    try {
      const { title } = savePhotoDto;
      const photo = this.create();

      photo.title = title;
      photo.user = user;
      await photo.save();
      return photo;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
