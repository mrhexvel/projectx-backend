import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Информация о текущем пользователе',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getMe(@CurrentUser() user: any) {
    return this.usersService.getMe(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя обновлены' })
  @ApiResponse({ status: 409, description: 'Public handle уже занят' })
  async updateMe(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateMe(user.id, updateUserDto);
  }

  @Put('me/profile')
  @ApiOperation({ summary: 'Обновить профиль текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль обновлен' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Public()
  @Get(':handle')
  @ApiOperation({ summary: 'Получить публичный профиль по handle' })
  @ApiParam({ name: 'handle', description: 'Публичный handle пользователя' })
  @ApiResponse({ status: 200, description: 'Публичный профиль пользователя' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getPublicProfile(@Param('handle') handle: string) {
    return this.usersService.getPublicProfile(handle);
  }
}
