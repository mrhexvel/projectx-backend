import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiService } from '../ai/ai.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private aiService: AiService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Получить все проекты текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список проектов' })
  async findAll(@CurrentUser() user: any) {
    return this.projectsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый проект' })
  @ApiResponse({ status: 201, description: 'Проект успешно создан' })
  @ApiResponse({ status: 409, description: 'Slug уже занят' })
  async create(
    @CurrentUser() user: any,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить проект по ID' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse({ status: 200, description: 'Информация о проекте' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить проект' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse({ status: 200, description: 'Проект обновлен' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user.id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить проект' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse({ status: 200, description: 'Проект удален' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.remove(id, user.id);
  }

  @Post(':id/media')
  @ApiOperation({ summary: 'Добавить медиа файл к проекту' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse({ status: 201, description: 'Медиа файл добавлен' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async addMedia(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { url: string; type: string; altText?: string },
  ) {
    return this.projectsService.addMedia(
      id,
      user.id,
      body.url,
      body.type,
      body.altText,
    );
  }

  @Delete(':id/media/:mediaId')
  @ApiOperation({ summary: 'Удалить медиа файл из проекта' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiParam({ name: 'mediaId', description: 'ID медиа файла' })
  @ApiResponse({ status: 200, description: 'Медиа файл удален' })
  @ApiResponse({ status: 404, description: 'Проект или медиа файл не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async removeMedia(
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.removeMedia(id, mediaId, user.id);
  }

  @Post(':id/ai/describe')
  @ApiOperation({ summary: 'Сгенерировать описание проекта с помощью AI' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse({ status: 200, description: 'Описание проекта сгенерировано' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async generateDescription(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const project = await this.projectsService.findOne(id, user.id);
    const description = await this.aiService.generateProjectDescription(
      project.title,
      project.techStack,
    );
    return { description };
  }
}
