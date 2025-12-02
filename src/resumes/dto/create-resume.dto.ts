import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({
    description: 'Название резюме',
    example: 'Frontend Developer Resume',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description:
      'Slug резюме (автоматически генерируется из названия, если не указан)',
    example: 'frontend-developer-resume',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Описание резюме',
    example: 'Резюме для позиции Frontend Developer',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
