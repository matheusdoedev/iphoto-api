import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../users/repositories/user.repository';
import { ISignUpResponse } from './interfaces/auth.interface';
import { SignUpDto } from './schemas/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<ISignUpResponse | string> {
    try {
      const data = await this.userRepository.createUser(signUpDto);

      if (typeof data === 'string') {
        return data;
      }

      const user = data;
      const jwtPayload = { id: user.id };
      const token = this.jwtService.sign(jwtPayload);
      return {
        user,
        token,
      };
    } catch (error) {
      return (error as Error).message;
    }
  }
}
