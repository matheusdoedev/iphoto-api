import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PhotosModule } from './modules/photos/photos.module';
import { AlbumsModule } from './modules/albums/albums.module';
import configuration from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PhotosModule,
    AlbumsModule,
  ],
})
export class AppModule {}
