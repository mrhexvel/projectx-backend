import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateResumeVersionDto {
  @ApiProperty({
    description: 'Содержимое резюме (markdown или JSON)',
    example: '# Experience\n\n## Company Name\n- Developed...',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Тег версии', example: 'v1.0' })
  @IsOptional()
  @IsString()
  versionTag?: string;
}
