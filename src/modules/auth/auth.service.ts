import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserRepository } from '../users/repositories/user.repository';
import { ISignUpResponse } from './interfaces/auth.interface';
import { SignInDto } from './schemas/signin.dto';
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

  async signin(signInDto: SignInDto): Promise<ISignUpResponse | string> {
    try {
      const { email, password } = signInDto;

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new Error('It does not have a account with this email.');
      }

      const hash = await bcrypt.hash(password, user.salt);

      if (hash !== user.password) {
        throw new Error('Wrong password');
      }

      const jwtPayload = { id: user.id };
      const token = this.jwtService.sign(jwtPayload);
      delete user.password;
      delete user.salt;
      return {
        user,
        token,
      };
    } catch (error) {
      return (error as Error).message;
    }
  }
}
