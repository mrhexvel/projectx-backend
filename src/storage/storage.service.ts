import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'S3_SECRET_ACCESS_KEY',
    );
    const region = this.configService.get<string>('S3_REGION');

    this.bucketName =
      this.configService.get<string>('S3_BUCKET_NAME') || 'portfoliox-media';

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region,
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true,
      });
    } else {
      console.warn(
        'S3 credentials not configured, storage features will be disabled',
      );
    }
  }

  async generatePresignedUploadUrl(
    fileName: string,
    contentType: string,
    folder: string = 'uploads',
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    const fileExtension = fileName.split('.').pop();
    const fileKey = `${folder}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return {
      uploadUrl,
      fileKey,
    };
  }

  async generatePresignedDownloadUrl(
    fileKey: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ fileKey: string; publicUrl: string }> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `${folder}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return {
      fileKey,
      publicUrl: this.getPublicUrl(fileKey),
    };
  }

  getPublicUrl(fileKey: string): string {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const bucketUuid = this.configService.get<string>('S3_BUCKET_UUID');

    if (endpoint && bucketName) {
      return `https://${bucketUuid}.selstorage.ru/${fileKey}`;
    }

    return fileKey;
  }
}
