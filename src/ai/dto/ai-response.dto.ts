import { ApiProperty } from '@nestjs/swagger';

export class ImproveTextResponseDto {
  @ApiProperty({
    description: 'Улучшенный текст',
    example: 'Разработал и внедрил систему, которая увеличила производительность на 40%',
  })
  improvedText: string;
}

export class CoverLetterResponseDto {
  @ApiProperty({
    description: 'Сгенерированное сопроводительное письмо',
    example: 'Уважаемый [Имя],\n\nЯ пишу, чтобы выразить заинтересованность...',
  })
  coverLetter: string;
}

export class AnalyzeVsJobResponseDto {
  @ApiProperty({
    description: 'Оценка совместимости резюме с вакансией (от 0 до 1)',
    example: 0.75,
  })
  score: number;

  @ApiProperty({
    description: 'Предложения по улучшению резюме',
    type: [String],
    example: [
      'Добавьте больше информации о опыте работы с React',
      'Укажите конкретные метрики достижений',
    ],
  })
  suggestions: string[];

  @ApiProperty({
    description: 'Сильные стороны резюме',
    type: [String],
    example: [
      'Отличный опыт работы с Node.js',
      'Сильные навыки работы в команде',
    ],
  })
  strengths: string[];

  @ApiProperty({
    description: 'Отсутствующие ключевые слова',
    type: [String],
    example: ['TypeScript', 'Docker', 'Kubernetes'],
  })
  missingKeywords: string[];
}

export class GenerateDescriptionResponseDto {
  @ApiProperty({
    description: 'Сгенерированное описание проекта',
    example: 'Современная платформа для электронной коммерции, построенная на React и Node.js...',
  })
  description: string;
}

