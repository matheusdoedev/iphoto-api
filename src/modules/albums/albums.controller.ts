import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { SavePhotoDto } from '../photos/schemas/save-photo.dto';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumServide: AlbumsService) {}

  @Post(':userId')
  async postCreateAlbum(
    @Param('userId') userId: string,
    @Body() saveAlbumDto: SavePhotoDto,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumServide.createAlbum({
      userId,
      ...saveAlbumDto,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }
}
