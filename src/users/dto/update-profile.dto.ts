import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Биография пользователя',
    example: 'Опытный разработчик с 5+ годами опыта',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Видимость профиля', example: true })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
