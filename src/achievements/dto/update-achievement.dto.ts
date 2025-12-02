import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAchievementDto {
  @ApiPropertyOptional({
    description: 'Название достижения',
    example: 'Победитель хакатона 2024',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Описание достижения',
    example:
      'Занял первое место на хакатоне по разработке мобильных приложений',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    description: 'Дата достижения',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на достижение',
    example: 'https://example.com/achievement',
  })
  @IsOptional()
  @IsUrl()
  link?: string;
}
