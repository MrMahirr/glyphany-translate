import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JobsService } from './jobs.service';

@Controller('translations')
@UseGuards(JwtAuthGuard)
export class TranslationsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTranslation(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }), // 50MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    ) file: any,
    @Body('targetLang') targetLang: string,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.createTranslation(file, targetLang, user.id);
  }

  @Get()
  async listTranslations(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.listTranslations(user.id, page, limit);
  }

  @Get(':id/content')
  async getTranslationContent(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.getTranslationContent(id, user.id);
  }
}
