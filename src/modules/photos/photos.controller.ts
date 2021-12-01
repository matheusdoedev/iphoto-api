import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PhotosService } from './photos.service';
import { SavePhotoDto } from './schemas/save-photo.dto';
import { UpdatePhotoDto } from './schemas/update-photo.dto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService) {}

  @Post(':userId')
  async postCreatePhoto(
    @Param('userId') userId: string,
    @Body() savePhotoDto: Omit<SavePhotoDto, 'userId'>,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.createPhoto({
      userId,
      ...savePhotoDto,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }

  @Put(':id')
  async putUpdatePhoto(
    @Param('photoId') photoId: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.updatePhoto({
      photoId,
      ...updatePhotoDto,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @Put('image/:id')
  @UseInterceptors(FileInterceptor('image'))
  async putUpdatePhotoImage(
    @Param('id') photoId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.updatePhotoImage(photoId, file);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @Delete(':photoId')
  async deletePhoto(
    @Param('photoId') photoId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.deletePhoto(photoId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json({ message: 'Photo removed.' });
  }

  @Get('user/:userId')
  async getUserPhotos(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.indexUserPhotos(userId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @Get(':photoId')
  async getPhotoById(
    @Param('photoId') photoId: string,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.showPhotoById(photoId);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }
}
