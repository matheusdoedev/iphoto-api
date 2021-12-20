import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  Req,
  Put,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { PaginationDto } from 'src/shared/schemas/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SavePhotoDto } from '../photos/schemas/save-photo.dto';
import { User } from '../users/entities/user.entity';
import { AlbumsService } from './albums.service';
import { UpdateAlbumDto } from './schemas/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserAlbums(
    @Query() getUserAlbumsDto: PaginationDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const user = req.user as User;
    const data = await this.albumService.indexUserAlbums(
      user,
      getUserAlbumsDto,
    );

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async postCreateAlbum(
    @Body() saveAlbumDto: SavePhotoDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const user = req.user as User;
    const data = await this.albumService.createAlbum({
      user,
      ...saveAlbumDto,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
