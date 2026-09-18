import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageService } from './interfaces/storage.interface';

@Injectable()
export class StorageService implements IStorageService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');

    this.s3Client = new S3Client({
      region: 'us-east-1', // MinIO requires a region, us-east-1 is standard
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
      forcePathStyle: true, // Necessary for MinIO
    });
  }

  async uploadFile(bucket: string, key: string, file: Buffer, contentType: string): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      });
      await this.s3Client.send(command);
      this.logger.log(`File uploaded successfully to ${bucket}/${key}`);
    } catch (error) {
      this.logger.error(`Error uploading file to ${bucket}/${key}`, error);
      throw error;
    }
  }

  async getPresignedUrl(bucket: string, key: string, expiresInSeconds: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
      return url;
    } catch (error) {
      this.logger.error(`Error generating presigned url for ${bucket}/${key}`, error);
      throw error;
    }
  }
}
