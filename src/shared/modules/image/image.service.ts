import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<S3.ManagedUpload.SendData | string> {
    try {
      const s3 = new S3();
      const imageUploaded = await s3
        .upload({
          Bucket: this.configService.get('s3.bucket'),
          Body: file.buffer,
          Key: `${folderName}/${Date.now()}-${file.originalname}`,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();

      return imageUploaded;
    } catch (error) {
      return (error as Error).message;
    }
  }
}
