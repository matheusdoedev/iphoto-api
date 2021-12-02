import { User } from 'src/modules/users/entities/user.entity';

export class SavePhotoDto {
  title: string;
  user: User;
  albumId?: string;
}
