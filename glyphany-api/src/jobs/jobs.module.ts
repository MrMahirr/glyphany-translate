import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { TranslationsController } from './translations.controller';
import { JobsService } from './jobs.service';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { QueueModule } from '../queue/queue.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, StorageModule, QueueModule, AuthModule],
  controllers: [JobsController, TranslationsController],
  providers: [JobsService],
})
export class JobsModule {}
