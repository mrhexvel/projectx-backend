import { ApiProperty } from '@nestjs/swagger';
import { MediaType, Visibility } from '@prisma/client';

export class ProjectLinkResponseDto {
  @ApiProperty({ description: 'ID ссылки', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'URL ссылки', example: 'https://github.com/user/project' })
  url: string;

  @ApiProperty({ description: 'Название ссылки', example: 'GitHub Repository', required: false, nullable: true })
  title: string | null;

  @ApiProperty({ description: 'ID проекта', example: 'clx1234567890', required: false, nullable: true })
  projectId: string | null;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ProjectMediaResponseDto {
  @ApiProperty({ description: 'ID медиа файла', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID проекта', example: 'clx1234567890' })
  projectId: string;

  @ApiProperty({ description: 'URL медиа файла', example: 'https://example.com/image.jpg' })
  url: string;

  @ApiProperty({ description: 'Тип медиа файла', enum: MediaType, example: MediaType.IMAGE })
  type: MediaType;

  @ApiProperty({ description: 'Альтернативный текст', required: false, nullable: true })
  altText: string | null;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ProjectCountsDto {
  @ApiProperty({ description: 'Количество медиа файлов', example: 3 })
  media: number;

  @ApiProperty({ description: 'Количество ссылок', example: 2 })
  links: number;
}

export class ProjectResponseDto {
  @ApiProperty({ description: 'ID проекта', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({ description: 'Название проекта', example: 'E-commerce Platform' })
  title: string;

  @ApiProperty({ description: 'Slug проекта', example: 'e-commerce-platform' })
  slug: string;

  @ApiProperty({ description: 'Краткое описание', required: false, nullable: true })
  shortDesc: string | null;

  @ApiProperty({ description: 'Полное описание', required: false, nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Технологический стек', type: [String], example: ['React', 'Node.js', 'PostgreSQL'] })
  techStack: string[];

  @ApiProperty({ description: 'Видимость проекта', enum: Visibility, example: Visibility.PUBLIC })
  visibility: Visibility;

  @ApiProperty({ description: 'Медиа файлы проекта', type: [ProjectMediaResponseDto], required: false })
  media?: ProjectMediaResponseDto[];

  @ApiProperty({ description: 'Ссылки проекта', type: [ProjectLinkResponseDto], required: false })
  links?: ProjectLinkResponseDto[];

  @ApiProperty({ description: 'Количество элементов', type: ProjectCountsDto, required: false })
  _count?: ProjectCountsDto;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

