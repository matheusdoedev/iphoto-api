import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import { S3 } from 'aws-sdk';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {}

  private getS3Service(): S3 {
    return new S3({
      region: this.configService.get('s3.region'),
      credentials: {
        accessKeyId: this.configService.get('s3.accessKey'),
        secretAccessKey: this.configService.get('s3.secretKey'),
      },
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<S3.ManagedUpload.SendData | string> {
    try {
      const fileStream = fs.createReadStream(file.path);

      const uploadParams: S3.PutObjectRequest = {
        Bucket: this.configService.get('s3.bucket'),
        Body: fileStream,
        Key: `${folderName}/${Date.now()}-${file.originalname}`,
      };

      const imageUploaded = await this.getS3Service()
        .upload(uploadParams)
        .promise();

      return imageUploaded;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async deleteImage(imageKey: string): Promise<void | string> {
    try {
      const deleteParams = {
        Key: imageKey,
        Bucket: this.configService.get('s3.bucket'),
      };

      await this.getS3Service().deleteObject(deleteParams).promise();
    } catch (error) {
      return (error as Error).message;
    }
  }
}
