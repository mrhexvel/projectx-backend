import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateResumeDto {
  @ApiPropertyOptional({
    description: 'Название резюме',
    example: 'Frontend Developer Resume',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({
    description: 'Описание резюме',
    example: 'Резюме для позиции Frontend Developer',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Статус публикации резюме',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
