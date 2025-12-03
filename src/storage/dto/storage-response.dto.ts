import { ApiProperty } from '@nestjs/swagger';

export class PresignedUploadResponseDto {
  @ApiProperty({
    description: 'Presigned URL для загрузки файла',
    example: 'https://s3.example.com/bucket/file?X-Amz-Algorithm=...',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'Ключ файла в хранилище',
    example: 'uploads/123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  fileKey: string;

  @ApiProperty({
    description: 'Публичный URL файла',
    example: 'https://storage.example.com/bucket/uploads/123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  publicUrl: string;
}

export class PresignedDownloadResponseDto {
  @ApiProperty({
    description: 'Presigned URL для скачивания файла',
    example: 'https://s3.example.com/bucket/file?X-Amz-Algorithm=...',
  })
  downloadUrl: string;
}

