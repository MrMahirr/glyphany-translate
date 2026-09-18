import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDatabaseService } from '../database/interfaces/database.interface';
import { IStorageService } from '../storage/interfaces/storage.interface';
import { IQueueService } from '../queue/interfaces/queue.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JobsService {
  private readonly bucketName: string;

  constructor(
    @Inject('IDatabaseService') private readonly db: IDatabaseService,
    @Inject('IStorageService') private readonly storage: IStorageService,
    @Inject('IQueueService') private readonly queue: IQueueService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('S3_BUCKET') || 'pdf-translator';
  }

  async createJob(file: any, targetLang: string) {
    // 1. Veritabanına kaydı oluştur (UUID almak için RETURNING id)
    const insertQuery = `
      INSERT INTO jobs (target_lang, status) 
      VALUES ($1, 'queued') 
      RETURNING id
    `;
    const rows = await this.db.query(insertQuery, [targetLang]);
    const jobId = rows[0].id;

    // 2. Dosyayı MinIO'ya yükle
    const s3Path = `originals/${jobId}.pdf`;
    await this.storage.uploadFile(this.bucketName, s3Path, file.buffer, file.mimetype);

    // 3. Veritabanındaki kaydı S3 path ile güncelle
    await this.db.execute(`UPDATE jobs SET source_pdf_path = $1 WHERE id = $2`, [s3Path, jobId]);

    // 4. Job'u Redis kuyruğuna at (worker için)
    const jobData = {
      job_id: jobId,
      s3_path: s3Path,
      target_lang: targetLang,
    };
    await this.queue.pushJob('translation_queue', jobData);

    return { jobId, status: 'queued' };
  }

  async getJobStatus(jobId: string) {
    const rows = await this.db.query(`SELECT id, status, error_message FROM jobs WHERE id = $1`, [jobId]);
    if (rows.length === 0) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }
    return rows[0];
  }

  async getJobResult(jobId: string) {
    const rows = await this.db.query(
      `SELECT status, output_pdf_path, output_json_path FROM jobs WHERE id = $1`, 
      [jobId]
    );

    if (rows.length === 0) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const job = rows[0];
    if (job.status !== 'done') {
      return { status: job.status, message: 'Result is not ready yet' };
    }

    const outputPdfUrl = job.output_pdf_path 
      ? await this.storage.getPresignedUrl(this.bucketName, job.output_pdf_path) 
      : null;
      
    const outputJsonUrl = job.output_json_path 
      ? await this.storage.getPresignedUrl(this.bucketName, job.output_json_path) 
      : null;

    return {
      status: job.status,
      outputPdfUrl,
      outputJsonUrl,
    };
  }
}
