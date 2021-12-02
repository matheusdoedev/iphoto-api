import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SignInDto } from './schemas/signin.dto';
import { SignUpDto } from './schemas/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async postSignUp(
    @Body() signUpDto: SignUpDto,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>> | string> {
    const data = await this.authService.signup(signUpDto);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }

  @Post('signin')
  async postSignIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>> | string> {
    const data = await this.authService.signin(signInDto);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }
}
