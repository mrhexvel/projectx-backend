import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';
import {
  PresignedDownloadResponseDto,
  PresignedUploadResponseDto,
} from './dto/storage-response.dto';
import { StorageService } from './storage.service';

@ApiTags('storage')
@ApiBearerAuth()
@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('presigned-upload')
  @ApiOperation({ summary: 'Получить presigned URL для загрузки файла' })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL для загрузки сгенерирован',
    type: PresignedUploadResponseDto,
  })
  async generatePresignedUploadUrl(
    @Body() body: { fileName: string; contentType: string; folder?: string },
  ) {
    const { uploadUrl, fileKey } =
      await this.storageService.generatePresignedUploadUrl(
        body.fileName,
        body.contentType,
        body.folder,
      );

    return {
      uploadUrl,
      fileKey,
      publicUrl: this.storageService.getPublicUrl(fileKey),
    };
  }

  @Post('presigned-download')
  @ApiOperation({ summary: 'Получить presigned URL для скачивания файла' })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL для скачивания сгенерирован',
    type: PresignedDownloadResponseDto,
  })
  async generatePresignedDownloadUrl(
    @Body() body: { fileKey: string; expiresIn?: number },
  ) {
    const downloadUrl = await this.storageService.generatePresignedDownloadUrl(
      body.fileKey,
      body.expiresIn,
    );

    return { downloadUrl };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить файл напрямую в хранилище' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Файл для загрузки',
    type: UploadFileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Файл успешно загружен',
    type: UploadFileResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folder?: string },
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await this.storageService.uploadFile(
      file,
      body.folder || 'uploads',
    );

    return result;
  }
}
