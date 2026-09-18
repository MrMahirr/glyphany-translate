import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IStorageService',
      useClass: StorageService,
    },
  ],
  exports: ['IStorageService'],
})
export class StorageModule {}
