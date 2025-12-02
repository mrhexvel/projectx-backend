import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        media: true,
        links: true,
        _count: {
          select: {
            media: true,
            links: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        media: true,
        links: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const slug =
      createProjectDto.slug ||
      createProjectDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const existing = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Slug already taken');
    }

    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        slug,
        userId,
        techStack: createProjectDto.techStack || [],
      },
    });
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id, userId);

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addMedia(
    id: string,
    userId: string,
    url: string,
    type: string,
    altText?: string,
  ) {
    await this.findOne(id, userId);

    return this.prisma.projectMedia.create({
      data: {
        projectId: id,
        url,
        type: type as MediaType,
        altText,
      },
    });
  }

  async removeMedia(projectId: string, mediaId: string, userId: string) {
    const project = await this.findOne(projectId, userId);

    const media = await this.prisma.projectMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.projectId !== projectId) {
      throw new NotFoundException('Media not found');
    }

    return this.prisma.projectMedia.delete({
      where: { id: mediaId },
    });
  }
}
