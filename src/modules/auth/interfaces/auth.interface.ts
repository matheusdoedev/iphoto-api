import { User } from 'src/modules/users/entities/user.entity';

export class ISignUpResponse {
  user: User;
  token: string;
}
