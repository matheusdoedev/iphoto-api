import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/repositories/user.repository';
import { jwtConfig } from 'src/shared/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
