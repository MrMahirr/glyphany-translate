import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IDatabaseService',
      useClass: DatabaseService,
    },
  ],
  exports: ['IDatabaseService'],
})
export class DatabaseModule {}
