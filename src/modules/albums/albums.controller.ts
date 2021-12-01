import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  Put,
  Get,
} from '@nestjs/common';
import { Response } from 'express';

import { SavePhotoDto } from '../photos/schemas/save-photo.dto';
import { AlbumsService } from './albums.service';
import { UpdateAlbumDto } from './schemas/update-album.dto';

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

  @Get(':albumId')
  async getAlbumByID(
    @Param('albumId') albumId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumService.showAlbumById(albumId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }

  @Get('user/:userId')
  async getUserAlbums(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumService.indexUserAlbums(userId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @Get('photos/:albumId')
  async getUserPhotos(
    @Param('albumId') albumId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumService.indexAlbumPhotos(albumId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @Put(':albumId')
  async putUpdateAlbum(
    @Param('albumId') albumId: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.albumService.updateAlbum({
      ...updateAlbumDto,
      albumId,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
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
