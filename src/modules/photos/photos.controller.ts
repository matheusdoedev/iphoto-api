import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { PhotosService } from './photos.service';
import { SavePhotoDto } from './schemas/save-photo.dto';
import { UpdatePhotoDto } from './schemas/update-photo.dto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async postCreatePhoto(
    @Body() savePhotoDto: Omit<SavePhotoDto, 'userId'>,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.createPhoto({
      user: req.user,
      ...savePhotoDto,
    });

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(201).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':photoId')
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

  @UseGuards(JwtAuthGuard)
  @Put('image/:photoId')
  @UseInterceptors(FileInterceptor('image'))
  async putUpdatePhotoImage(
    @Param('photoId') photoId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const data = await this.photoService.updatePhotoImage(photoId, file);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserPhotos(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<unknown, Record<string, unknown>> | string> {
    const user = req.user as User;
    const data = await this.photoService.indexUserPhotos(user);

    if (typeof data === 'string') {
      return res.status(400).json({ message: data });
    }

    return res.status(200).json(data);
  }

  @UseGuards(JwtAuthGuard)
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
