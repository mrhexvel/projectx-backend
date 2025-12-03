import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { AnalyzeVsJobDto } from './dto/analyze-vs-job.dto';
import {
  AnalyzeVsJobResponseDto,
  CoverLetterResponseDto,
  ImproveTextResponseDto,
} from './dto/ai-response.dto';
import { CoverLetterDto } from './dto/cover-letter.dto';
import { ImproveTextDto } from './dto/improve-text.dto';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('improve-text')
  @ApiOperation({ summary: 'Улучшить текст с помощью AI' })
  @ApiResponse({ status: 200, description: 'Текст улучшен', type: ImproveTextResponseDto })
  async improveText(@Body() improveTextDto: ImproveTextDto) {
    const improvedText = await this.aiService.improveText(improveTextDto);
    return { improvedText };
  }

  @Post('cover-letter')
  @ApiOperation({
    summary: 'Сгенерировать сопроводительное письмо с помощью AI',
  })
  @ApiResponse({
    status: 200,
    description: 'Сопроводительное письмо сгенерировано',
    type: CoverLetterResponseDto,
  })
  async generateCoverLetter(@Body() coverLetterDto: CoverLetterDto) {
    const coverLetter =
      await this.aiService.generateCoverLetter(coverLetterDto);
    return { coverLetter };
  }

  @Post('analyze-vs-job')
  @ApiOperation({
    summary: 'Проанализировать резюме относительно описания вакансии',
  })
  @ApiResponse({ status: 200, description: 'Анализ выполнен', type: AnalyzeVsJobResponseDto })
  async analyzeVsJob(@Body() analyzeDto: AnalyzeVsJobDto) {
    return this.aiService.analyzeVsJob(analyzeDto);
  }
}
