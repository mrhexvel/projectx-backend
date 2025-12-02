import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true,
        _count: {
          select: {
            resumes: true,
            projects: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateMe(userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.publicHandle) {
      const existingUser = await this.prisma.user.findUnique({
        where: { publicHandle: updateUserDto.publicHandle },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Public handle already taken');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getPublicProfile(handle: string) {
    const user = await this.prisma.user.findUnique({
      where: { publicHandle: handle },
      include: {
        profiles: {
          where: { visible: true },
          include: {
            links: true,
          },
        },
        resumes: {
          where: { isPublished: true },
          include: {
            versions: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        projects: {
          where: { visibility: 'PUBLIC' },
          include: {
            media: true,
            links: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        achievements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, email, ...publicProfile } = user;
    return publicProfile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: updateProfileDto,
      create: {
        userId,
        ...updateProfileDto,
      },
    });

    return profile;
  }
}
