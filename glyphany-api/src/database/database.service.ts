import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
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
      
      // Run migrations
      await this.runMigrations();
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

  private async runMigrations() {
    this.logger.log('Starting migration runner...');
    
    // 1. Create migration_history table if not exists
    await this.execute(`
      CREATE TABLE IF NOT EXISTS migration_history (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 2. Read migration files
    const migrationsDir = path.join(process.cwd(), 'src', 'database', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      this.logger.warn(`Migrations directory not found at ${migrationsDir}`);
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // ensures 001, 002 order

    // 3. Get applied migrations
    const appliedRows = await this.query(`SELECT filename FROM migration_history`);
    const appliedMigrations = new Set(appliedRows.map(row => row.filename));

    for (const file of files) {
      if (!appliedMigrations.has(file)) {
        this.logger.log(`Applying migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        // 4. Run inside transaction
        await this.transaction(async (dbClient) => {
          await dbClient.execute(sql);
          await dbClient.execute(
            `INSERT INTO migration_history (filename) VALUES ($1)`,
            [file]
          );
        });
        this.logger.log(`Successfully applied migration: ${file}`);
      }
    }
    
    this.logger.log('Migration runner finished.');
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
