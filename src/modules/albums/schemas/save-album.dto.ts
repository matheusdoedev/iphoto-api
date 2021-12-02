import { User } from 'src/modules/users/entities/user.entity';

export class SaveAlbumDto {
  user: User;
  title: string;
}
