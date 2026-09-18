import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import { IDatabaseClient, IDatabaseService } from './interfaces/database.interface';

@Injectable()
export class DatabaseService implements IDatabaseService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    this.pool = new Pool({
      connectionString,
      max: 20, // Max connection pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      this.logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    try {
      const client = await this.pool.connect();
      client.release();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Error connecting to the database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Database pool connection closed.');
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(text, params);
    return result.rows;
  }

  async execute(text: string, params?: any[]): Promise<void> {
    await this.pool.query(text, params);
  }

  async transaction<T>(callback: (client: IDatabaseClient) => Promise<T>): Promise<T> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const dbClient: IDatabaseClient = {
        query: async <R = any>(text: string, params?: any[]): Promise<R[]> => {
          const res = await client.query(text, params);
          return res.rows;
        },
        execute: async (text: string, params?: any[]): Promise<void> => {
          await client.query(text, params);
        }
      };

      const result = await callback(dbClient);
      
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
