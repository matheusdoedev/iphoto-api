import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PhotoModule } from './modules/photo/photo.module';
import { AlbumModule } from './modules/album/album.module';

@Module({
  imports: [UserModule, PhotoModule, AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
