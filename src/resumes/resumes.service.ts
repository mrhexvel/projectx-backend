import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResumeVersionDto } from './dto/create-resume-version.dto';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            versions: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return resume;
  }

  async create(userId: string, createResumeDto: CreateResumeDto) {
    const slug =
      createResumeDto.slug ||
      createResumeDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const existing = await this.prisma.resume.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Slug already taken');
    }

    return this.prisma.resume.create({
      data: {
        ...createResumeDto,
        slug,
        userId,
      },
    });
  }

  async update(id: string, userId: string, updateResumeDto: UpdateResumeDto) {
    const resume = await this.findOne(id, userId);

    return this.prisma.resume.update({
      where: { id },
      data: updateResumeDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.resume.delete({
      where: { id },
    });
  }

  async createVersion(
    id: string,
    userId: string,
    createVersionDto: CreateResumeVersionDto,
  ) {
    await this.findOne(id, userId);

    return this.prisma.resumeVersion.create({
      data: {
        resumeId: id,
        ...createVersionDto,
      },
    });
  }

  async publish(id: string, userId: string) {
    const resume = await this.findOne(id, userId);

    if (!resume.versions || resume.versions.length === 0) {
      throw new ConflictException('Cannot publish resume without versions');
    }

    return this.prisma.resume.update({
      where: { id },
      data: { isPublished: true },
    });
  }

  async getPublicResume(slug: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { slug, isPublished: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            headline: true,
            avatarUrl: true,
            publicHandle: true,
          },
        },
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }
}
