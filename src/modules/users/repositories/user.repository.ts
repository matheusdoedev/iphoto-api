import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { SignUpDto } from 'src/modules/auth/schemas/signup.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: SignUpDto): Promise<User | string> {
    const { email, name, password } = createUserDto;
    const foundUser = await this.findOne({
      where: { email },
    });

    if (foundUser) {
      return 'User already exists.';
    }

    try {
      const user = this.create();
      user.email = email;
      user.name = name;
      user.accepted_terms = true;
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
