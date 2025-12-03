import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { type Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateResumeVersionDto } from './dto/create-resume-version.dto';
import { CreateResumeDto } from './dto/create-resume.dto';
import {
  PublicResumeResponseDto,
  ResumeResponseDto,
  ResumeVersionResponseDto,
} from './dto/resume-response.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { PdfService } from './pdf.service';
import { ResumesService } from './resumes.service';

@ApiTags('resumes')
@ApiBearerAuth()
@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(
    private resumesService: ResumesService,
    private pdfService: PdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все резюме текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список резюме',
    type: [ResumeResponseDto],
  })
  async findAll(@CurrentUser() user: any) {
    return this.resumesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новое резюме' })
  @ApiResponse({ status: 201, description: 'Резюме успешно создано', type: ResumeResponseDto })
  @ApiResponse({ status: 409, description: 'Slug уже занят' })
  async create(
    @CurrentUser() user: any,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    return this.resumesService.create(user.id, createResumeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить резюме по ID' })
  @ApiParam({ name: 'id', description: 'ID резюме' })
  @ApiResponse({ status: 200, description: 'Информация о резюме', type: ResumeResponseDto })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resumesService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить резюме' })
  @ApiParam({ name: 'id', description: 'ID резюме' })
  @ApiResponse({ status: 200, description: 'Резюме обновлено', type: ResumeResponseDto })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumesService.update(id, user.id, updateResumeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить резюме' })
  @ApiParam({ name: 'id', description: 'ID резюме' })
  @ApiResponse({ status: 200, description: 'Резюме удалено', type: ResumeResponseDto })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resumesService.remove(id, user.id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Создать новую версию резюме' })
  @ApiParam({ name: 'id', description: 'ID резюме' })
  @ApiResponse({ status: 201, description: 'Версия резюме создана', type: ResumeVersionResponseDto })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async createVersion(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() createVersionDto: CreateResumeVersionDto,
  ) {
    return this.resumesService.createVersion(id, user.id, createVersionDto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Опубликовать резюме' })
  @ApiParam({ name: 'id', description: 'ID резюме' })
  @ApiResponse({ status: 200, description: 'Резюме опубликовано', type: ResumeResponseDto })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({
    status: 409,
    description: 'Невозможно опубликовать резюме без версий',
  })
  async publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resumesService.publish(id, user.id);
  }

  @Get(':id/export/pdf')
  @ApiOperation({ summary: 'Экспортировать резюме в PDF' })
  @ApiParam({ name: 'id', description: 'ID резюме' })
  @ApiResponse({
    status: 200,
    description: 'PDF файл резюме',
    content: { 'application/pdf': {} },
  })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async exportPdf(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const pdf = await this.pdfService.generatePdf(id, user.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="resume-${id}.pdf"`,
    );
    res.send(pdf);
  }

  @Public()
  @Get('public/:slug')
  @ApiOperation({ summary: 'Получить публичное резюме по slug' })
  @ApiParam({ name: 'slug', description: 'Slug резюме' })
  @ApiResponse({ status: 200, description: 'Публичное резюме', type: PublicResumeResponseDto })
  @ApiResponse({ status: 404, description: 'Резюме не найдено' })
  async getPublicResume(@Param('slug') slug: string) {
    return this.resumesService.getPublicResume(slug);
  }
}
