import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModule } from './modules/user/user.module';
import { PhotoModule } from './modules/photo/photo.module';
import { AlbumModule } from './modules/album/album.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('database.dialect'),
        synchronize: configService.get('database.synchronize'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        models: configService.get('database.models'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PhotoModule,
    AlbumModule,
  ],
})
export class AppModule {}
