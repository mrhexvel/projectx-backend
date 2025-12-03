import { ApiProperty } from '@nestjs/swagger';

export class ResumeVersionResponseDto {
  @ApiProperty({ description: 'ID версии резюме', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID резюме', example: 'clx1234567890' })
  resumeId: string;

  @ApiProperty({ description: 'Содержимое резюме', example: '{"sections": [...]}' })
  content: string;

  @ApiProperty({ description: 'Тег версии', example: 'v1.0', required: false, nullable: true })
  versionTag: string | null;

  @ApiProperty({ description: 'AI оценка', required: false, nullable: true })
  aiScore: number | null;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ResumeCountsDto {
  @ApiProperty({ description: 'Количество версий', example: 3 })
  versions: number;
}

export class ResumeResponseDto {
  @ApiProperty({ description: 'ID резюме', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({ description: 'Название резюме', example: 'Software Engineer Resume' })
  title: string;

  @ApiProperty({ description: 'Slug резюме', example: 'software-engineer-resume' })
  slug: string;

  @ApiProperty({ description: 'Описание резюме', required: false, nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Опубликовано ли резюме', example: false })
  isPublished: boolean;

  @ApiProperty({ description: 'Версии резюме', type: [ResumeVersionResponseDto], required: false })
  versions?: ResumeVersionResponseDto[];

  @ApiProperty({ description: 'Количество версий', type: ResumeCountsDto, required: false })
  _count?: ResumeCountsDto;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PublicResumeUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'Имя пользователя', required: false, nullable: true })
  name: string | null;

  @ApiProperty({ description: 'Заголовок профиля', required: false, nullable: true })
  headline: string | null;

  @ApiProperty({ description: 'URL аватара', required: false, nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ description: 'Публичный handle', required: false, nullable: true })
  publicHandle: string | null;
}

export class PublicResumeResponseDto {
  @ApiProperty({ description: 'ID резюме', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({ description: 'Название резюме', example: 'Software Engineer Resume' })
  title: string;

  @ApiProperty({ description: 'Slug резюме', example: 'software-engineer-resume' })
  slug: string;

  @ApiProperty({ description: 'Описание резюме', required: false, nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Опубликовано ли резюме', example: true })
  isPublished: boolean;

  @ApiProperty({ description: 'Данные пользователя', type: PublicResumeUserDto })
  user: PublicResumeUserDto;

  @ApiProperty({ description: 'Версии резюме', type: [ResumeVersionResponseDto] })
  versions: ResumeVersionResponseDto[];

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

