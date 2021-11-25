import { Controller, Get, Res } from '@nestjs/common';

import { Response } from 'express';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>> | string> {
    const data = await this.usersService.indexAll();

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }
}
