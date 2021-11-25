import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async indexAll(): Promise<User[] | string> {
    return await this.userRepository.getAllUsers();
  }
}
