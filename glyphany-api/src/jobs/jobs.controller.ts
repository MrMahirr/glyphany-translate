import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JobsService } from './jobs.service';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':id/status')
  async getJobStatus(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.getJobStatus(id, user.id);
  }

  @Post(':id/cancel')
  async cancelJob(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.cancelJob(id, user.id);
  }
}
