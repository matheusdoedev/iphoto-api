import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';

type PayloadType = {
  id: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadType): Promise<User | string> {
    try {
      const { id } = payload;
      const user = await this.userRepository.findOne(id, {
        relations: ['photos', 'albums'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
