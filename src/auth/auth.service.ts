import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto, res: Response) {
    const { email, password, name } = signupDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const publicHandle = await this.generateUniqueHandle(email);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        publicHandle,
      },
    });

    await this.prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.setCookies(res, tokens);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        publicHandle: user.publicHandle,
      },
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.setCookies(res, tokens);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        publicHandle: user.publicHandle,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.passwordHash) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'If user exists, password reset email sent' };
    }

    // TODO: реализовать отправку email с токеном сброса пароля
    return { message: 'If user exists, password reset email sent' };
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || (user as any).refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      this.setCookies(res, tokens);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          publicHandle: user.publicHandle,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, res: Response) {
    await this.updateRefreshToken(userId, null);
    this.clearCookies(res);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secret',
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken } as any,
    });
  }

  private setCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  private async generateUniqueHandle(email: string): Promise<string> {
    const baseHandle = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    let handle = baseHandle;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { publicHandle: handle },
      });

      if (!existing) {
        return handle;
      }

      handle = `${baseHandle}${counter}`;
      counter++;
    }
  }
}
