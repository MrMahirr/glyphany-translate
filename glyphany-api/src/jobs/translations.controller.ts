import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query, UseGuards, Delete } from '@nestjs/common';
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

  @Post(':id/regenerate')
  async updateAndRegenerate(
    @Param('id') id: string,
    @Body('pages') pages: any[],
    @CurrentUser() user: any,
  ) {
    return this.jobsService.updateAndRegenerate(id, user.id, pages);
  }

  @Post(':id/retranslate-block')
  async retranslateBlock(
    @Param('id') id: string,
    @Body('text') text: string,
    @Body('sourceLang') sourceLang: string,
    @Body('targetLang') targetLang: string,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.retranslateBlock(id, user.id, text, sourceLang, targetLang);
  }
  @Post(':id/cancel')
  async cancelJob(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.cancelJob(id, user.id);
  }

  @Delete(':id')
  async deleteJob(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.deleteJob(id, user.id);
  }
}
