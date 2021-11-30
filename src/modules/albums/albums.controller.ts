import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { SavePhotoDto } from '../photos/schemas/save-photo.dto';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Post(':userId')
  async postCreateAlbum(
    @Param('userId') userId: string,
    @Body() saveAlbumDto: SavePhotoDto,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumService.createAlbum({
      userId,
      ...saveAlbumDto,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }

  @Delete(':albumId')
  async deleteAlbum(
    @Param('albumId') albumId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumService.removeAlbum(albumId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json({ message: 'Album removed.' });
  }
}