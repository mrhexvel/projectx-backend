import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email пользователя для сброса пароля',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
