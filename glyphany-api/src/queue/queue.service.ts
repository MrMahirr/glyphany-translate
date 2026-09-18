import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IQueueService } from './interfaces/queue.interface';

@Injectable()
export class QueueService implements IQueueService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in environment variables');
    }

    this.redisClient = new Redis(redisUrl);

    this.redisClient.on('connect', () => {
      this.logger.log('Successfully connected to Redis.');
    });

    this.redisClient.on('error', (err) => {
      this.logger.error('Redis connection error', err);
    });
  }

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.disconnect();
      this.logger.log('Redis connection closed.');
    }
  }

  async pushJob(queueName: string, jobData: any): Promise<void> {
    try {
      const message = typeof jobData === 'string' ? jobData : JSON.stringify(jobData);
      await this.redisClient.lpush(queueName, message);
      this.logger.log(`Job pushed to queue ${queueName}`);
    } catch (error) {
      this.logger.error(`Error pushing job to queue ${queueName}`, error);
      throw error;
    }
  }
}
