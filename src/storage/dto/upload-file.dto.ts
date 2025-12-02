import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
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

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Файл для загрузки',
  })
  file: any;

  @ApiProperty({
    type: 'string',
    description: 'Папка для сохранения файла (опционально)',
    required: false,
    example: 'uploads',
  })
  folder?: string;
}

