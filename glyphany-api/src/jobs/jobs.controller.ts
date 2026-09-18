import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a PDF file and start a translation job' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'PDF file to translate',
    type: CreateJobDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async createJob(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }), // 50MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    ) file: any,
    @Body('target_lang') targetLang: string,
  ) {
    // Provide a default language if none provided
    const target = targetLang || 'TR';
    return this.jobsService.createJob(file, target);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the status of a translation job' })
  async getJobStatus(@Param('id') id: string) {
    return this.jobsService.getJobStatus(id);
  }

  @Get(':id/result')
  @ApiOperation({ summary: 'Get presigned S3 URLs for the translation results (PDF + JSON)' })
  async getJobResult(@Param('id') id: string) {
    return this.jobsService.getJobResult(id);
  }
}
