import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.achievement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    if (achievement.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return achievement;
  }

  async create(userId: string, createAchievementDto: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: {
        ...createAchievementDto,
        userId,
        date: createAchievementDto.date
          ? new Date(createAchievementDto.date)
          : undefined,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updateAchievementDto: UpdateAchievementDto,
  ) {
    await this.findOne(id, userId);

    return this.prisma.achievement.update({
      where: { id },
      data: {
        ...updateAchievementDto,
        date: updateAchievementDto.date
          ? new Date(updateAchievementDto.date)
          : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.achievement.delete({
      where: { id },
    });
  }
}
