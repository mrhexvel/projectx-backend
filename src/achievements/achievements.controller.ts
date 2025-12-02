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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@ApiTags('achievements')
@ApiBearerAuth()
@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все достижения текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список достижений' })
  async findAll(@CurrentUser() user: any) {
    return this.achievementsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новое достижение' })
  @ApiResponse({ status: 201, description: 'Достижение успешно создано' })
  async create(
    @CurrentUser() user: any,
    @Body() createAchievementDto: CreateAchievementDto,
  ) {
    return this.achievementsService.create(user.id, createAchievementDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить достижение по ID' })
  @ApiParam({ name: 'id', description: 'ID достижения' })
  @ApiResponse({ status: 200, description: 'Информация о достижении' })
  @ApiResponse({ status: 404, description: 'Достижение не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.achievementsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить достижение' })
  @ApiParam({ name: 'id', description: 'ID достижения' })
  @ApiResponse({ status: 200, description: 'Достижение обновлено' })
  @ApiResponse({ status: 404, description: 'Достижение не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(id, user.id, updateAchievementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить достижение' })
  @ApiParam({ name: 'id', description: 'ID достижения' })
  @ApiResponse({ status: 200, description: 'Достижение удалено' })
  @ApiResponse({ status: 404, description: 'Достижение не найдено' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.achievementsService.remove(id, user.id);
  }
}
