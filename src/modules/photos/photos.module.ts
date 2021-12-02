import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { PhotoRepository } from './repositories/photo.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ImageModule } from 'src/shared/modules/image/image.module';
import { UsersModule } from '../users/users.module';
import { AlbumRepository } from '../albums/repositories/album.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoRepository, AlbumRepository]),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('multer.dest'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ImageModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [TypeOrmModule],
})
export class PhotosModule {}
