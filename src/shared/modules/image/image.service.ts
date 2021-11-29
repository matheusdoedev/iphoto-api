import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

import { S3 } from 'aws-sdk';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<S3.ManagedUpload.SendData | string> {
    try {
      const s3 = new S3({
        region: this.configService.get('s3.region'),
        credentials: {
          accessKeyId: this.configService.get('s3.accessKey'),
          secretAccessKey: this.configService.get('s3.secretKey'),
        },
      });
      const fileStream = fs.createReadStream(file.path);

      const uploadParams: S3.PutObjectRequest = {
        Bucket: this.configService.get('s3.bucket'),
        Body: fileStream,
        Key: `${folderName}/${Date.now()}-${file.originalname}`,
      };

      const imageUploaded = await s3.upload(uploadParams).promise();

      return imageUploaded;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
