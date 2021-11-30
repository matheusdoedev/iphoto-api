import { EntityRepository, Repository } from 'typeorm';

import { Album } from '../entities/album.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SaveAlbumDto } from '../schemas/save-album.dto';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {
  async createAlbum(
    saveAlbumDto: SaveAlbumDto,
    user: User,
  ): Promise<Album | string> {
    try {
      const { title } = saveAlbumDto;
      const album = this.create();

      album.title = title;
      album.user = user;

      await album.save();
      return album;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
