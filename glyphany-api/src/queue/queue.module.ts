import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IQueueService',
      useClass: QueueService,
    },
  ],
  exports: ['IQueueService'],
})
export class QueueModule {}
