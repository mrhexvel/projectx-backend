import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [AiModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
