import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CoverLetterDto {
  @ApiProperty({ description: 'ID резюме', example: 'clx1234567890' })
  @IsString()
  resumeId: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Ищем опытного разработчика с опытом работы...',
  })
  @IsString()
  @MinLength(1)
  jobDescription: string;
}
