import { Module } from '@nestjs/common';
import { AchievementsModule } from './achievements/achievements.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ResumesModule } from './resumes/resumes.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ResumesModule,
    ProjectsModule,
    AchievementsModule,
    AiModule,
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
