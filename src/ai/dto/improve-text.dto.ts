import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ImproveTextDto {
  @ApiProperty({
    description: 'Текст для улучшения',
    example: 'Я разработал приложение',
  })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiPropertyOptional({
    description: 'Цель улучшения текста',
    example: 'Сделать текст более профессиональным',
  })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiPropertyOptional({ description: 'Язык текста', example: 'ru' })
  @IsOptional()
  @IsString()
  language?: string;
}
