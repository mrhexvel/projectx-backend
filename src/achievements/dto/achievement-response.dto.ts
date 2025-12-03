import { ApiProperty } from '@nestjs/swagger';

export class AchievementResponseDto {
  @ApiProperty({ description: 'ID достижения', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  userId: string;

  @ApiProperty({ description: 'Название достижения', example: 'Победитель хакатона' })
  title: string;

  @ApiProperty({ description: 'Описание достижения', required: false, nullable: true })
  body: string | null;

  @ApiProperty({ description: 'Дата достижения', example: '2025-01-01T00:00:00.000Z', required: false, nullable: true })
  date: Date | null;

  @ApiProperty({ description: 'Ссылка на достижение', example: 'https://example.com/achievement', required: false, nullable: true })
  link: string | null;

  @ApiProperty({ description: 'Дата создания', example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления', example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

