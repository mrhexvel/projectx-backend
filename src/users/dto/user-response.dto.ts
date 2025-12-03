import { ApiProperty } from '@nestjs/swagger';

export class LinkResponseDto {
  @ApiProperty({ description: 'ID ссылки', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'URL ссылки', example: 'https://github.com/user' })
  url: string;

  @ApiProperty({ description: 'Название ссылки', example: 'GitHub', required: false, nullable: true })
  title: string | null;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ProfileResponseDto {
  @ApiProperty({ description: 'ID профиля', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({ description: 'Биография', required: false, nullable: true })
  bio: string | null;

  @ApiProperty({ description: 'Видимость профиля', example: true })
  visible: boolean;

  @ApiProperty({ description: 'Ссылки профиля', type: [LinkResponseDto], required: false })
  links?: LinkResponseDto[];

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class UserCountsDto {
  @ApiProperty({ description: 'Количество резюме', example: 3 })
  resumes: number;

  @ApiProperty({ description: 'Количество проектов', example: 5 })
  projects: number;

  @ApiProperty({ description: 'Количество достижений', example: 2 })
  achievements: number;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Подтвержден ли email', example: false })
  emailVerified: boolean;

  @ApiProperty({ description: 'Имя пользователя', required: false, nullable: true })
  name: string | null;

  @ApiProperty({ description: 'Заголовок профиля', required: false, nullable: true })
  headline: string | null;

  @ApiProperty({ description: 'URL аватара', required: false, nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ description: 'Публичный handle', required: false, nullable: true })
  publicHandle: string | null;

  @ApiProperty({ description: 'Локаль', example: 'en', required: false, nullable: true })
  locale: string | null;

  @ApiProperty({ description: 'Профили пользователя', type: [ProfileResponseDto], required: false })
  profiles?: ProfileResponseDto[];

  @ApiProperty({ description: 'Количество элементов', type: UserCountsDto, required: false })
  _count?: UserCountsDto;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PublicProfileResponseDto {
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

  @ApiProperty({ description: 'Локаль', example: 'en', required: false, nullable: true })
  locale: string | null;

  @ApiProperty({ description: 'Профили пользователя', type: [ProfileResponseDto], required: false })
  profiles?: ProfileResponseDto[];

  @ApiProperty({ description: 'Опубликованные резюме', type: 'array', required: false })
  resumes?: any[];

  @ApiProperty({ description: 'Публичные проекты', type: 'array', required: false })
  projects?: any[];

  @ApiProperty({ description: 'Достижения', type: 'array', required: false })
  achievements?: any[];

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

