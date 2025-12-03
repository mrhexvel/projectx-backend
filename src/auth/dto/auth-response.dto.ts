import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя', example: 'clx1234567890' })
  id: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван Иванов', required: false, nullable: true })
  name: string | null;

  @ApiProperty({ description: 'Публичный handle пользователя', example: 'ivan_ivanov', required: false, nullable: true })
  publicHandle: string | null;
}

export class SignupResponseDto {
  @ApiProperty({ description: 'Данные пользователя', type: UserResponseDto })
  user: UserResponseDto;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Данные пользователя', type: UserResponseDto })
  user: UserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty({ description: 'Данные пользователя', type: UserResponseDto })
  user: UserResponseDto;
}

export class LogoutResponseDto {
  @ApiProperty({ description: 'Сообщение об успешном выходе', example: 'Logged out successfully' })
  message: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Сообщение о статусе запроса',
    example: 'If user exists, password reset email sent',
  })
  message: string;
}

