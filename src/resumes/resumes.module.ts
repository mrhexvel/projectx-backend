import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';

@Module({
  controllers: [ResumesController],
  providers: [ResumesService, PdfService, PrismaService],
  exports: [ResumesService],
})
export class ResumesModule {}
