import { MulterModuleOptions } from '@nestjs/platform-express';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

import { Album } from 'src/modules/albums/entities/album.entity';
import { Photo } from 'src/modules/photos/entities/photo.entity';
import { User } from 'src/modules/users/entities/user.entity';

interface IS3Options {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
}
interface IConfiguration {
  database: TypeOrmModuleOptions;
  multer: MulterModuleOptions;
  s3: IS3Options;
  jwt: JwtModuleOptions;
}

export default (): IConfiguration => ({
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Photo, Album],
  },
  multer: {
    dest: 'tmp/uploads',
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
