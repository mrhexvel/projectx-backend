import { ApiPropertyOptional } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: 'Название проекта',
    example: 'E-commerce Platform',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Краткое описание проекта',
    example: 'Современная платформа для электронной коммерции',
  })
  @IsOptional()
  @IsString()
  shortDesc?: string;

  @ApiPropertyOptional({
    description: 'Полное описание проекта',
    example: 'Полнофункциональная платформа для электронной коммерции',
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

  @ApiPropertyOptional({
    description: 'Видимость проекта',
    enum: Visibility,
    example: Visibility.PUBLIC,
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
