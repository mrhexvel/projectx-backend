import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Название проекта',
    example: 'E-commerce Platform',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description:
      'Slug проекта (автоматически генерируется из названия, если не указан)',
    example: 'e-commerce-platform',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Краткое описание проекта',
    example: 'Современная платформа для электронной коммерции',
  })
  @IsOptional()
  @IsString()
  shortDesc?: string;

  @ApiPropertyOptional({
    description: 'Полное описание проекта',
    example:
      'Полнофункциональная платформа для электронной коммерции с поддержкой множества платежных систем',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Технологический стек проекта',
    example: ['React', 'Node.js', 'PostgreSQL'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];
}
