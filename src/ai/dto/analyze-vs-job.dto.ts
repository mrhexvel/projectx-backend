import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AnalyzeVsJobDto {
  @ApiProperty({
    description: 'Текст резюме',
    example: 'Опытный разработчик с 5+ годами опыта...',
  })
  @IsString()
  @MinLength(1)
  resumeText: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Ищем опытного разработчика с опытом работы...',
  })
  @IsString()
  @MinLength(1)
  jobDescription: string;
}
