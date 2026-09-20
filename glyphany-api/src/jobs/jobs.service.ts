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

  async createTranslation(file: any, targetLang: string, userId: string) {
    const originalFileName = file.originalname || 'document.pdf';
    const fileSizeBytes = file.size || 0;
    
    // 1. Veritabanına kaydı oluştur
    const insertQuery = `
      INSERT INTO jobs (user_id, target_lang, status, original_file_name, file_size_bytes, percentage, current_step) 
      VALUES ($1, $2, 'pending', $3, $4, 0, 'pending') 
      RETURNING id, created_at as "createdAt"
    `;
    const rows = await this.db.query(insertQuery, [userId, targetLang, originalFileName, fileSizeBytes]);
    const job = rows[0];
    const jobId = job.id;

    // 2. Dosyayı MinIO'ya yükle
    const s3Path = `originals/${jobId}.pdf`;
    await this.storage.uploadFile(this.bucketName, s3Path, file.buffer, file.mimetype);

    // 3. Veritabanındaki kaydı S3 path ile güncelle
    await this.db.query(`UPDATE jobs SET source_pdf_path = $1 WHERE id = $2`, [s3Path, jobId]);

    // 4. Job'u Redis kuyruğuna at
    const jobData = {
      job_id: jobId,
      s3_path: s3Path,
      target_lang: targetLang,
    };
    await this.queue.pushJob('translation_queue', jobData);

    return {
      id: jobId,
      originalFileName: originalFileName,
      targetLanguage: targetLang,
      status: 'pending',
      progress: 0,
      createdAt: job.createdAt,
    };
  }

  async listTranslations(userId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;
    
    const countResult = await this.db.query(`SELECT COUNT(*) FROM jobs WHERE user_id = $1`, [userId]);
    const totalCount = parseInt(countResult[0].count, 10);
    
    const rows = await this.db.query(
      `SELECT id, original_file_name as "originalFileName", target_lang as "targetLanguage", 
              status, percentage as progress, created_at as "createdAt", completed_at as "completedAt",
              page_count as "pageCount", output_pdf_path
       FROM jobs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const items = await Promise.all(rows.map(async (row) => {
      let downloadUrl = undefined;
      if (row.status === 'completed' && row.output_pdf_path) {
        downloadUrl = await this.storage.getPresignedUrl(this.bucketName, row.output_pdf_path);
      }
      return {
        id: row.id,
        originalFileName: row.originalFileName,
        targetLanguage: row.targetLanguage,
        status: row.status,
        progress: row.progress || 0,
        createdAt: row.createdAt,
        completedAt: row.completedAt,
        downloadUrl,
        pageCount: row.pageCount
      };
    }));

    return {
      items,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / limit)
    };
  }

  async getJobStatus(jobId: string, userId: string) {
    const rows = await this.db.query(`
      SELECT id, status, percentage, estimated_time_remaining_sec, current_page, page_count,
             original_file_name, file_size_bytes, source_lang, target_lang, engine_version,
             created_at, updated_at
      FROM jobs WHERE id = $1 AND user_id = $2
    `, [jobId, userId]);

    if (rows.length === 0) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const job = rows[0];

    return {
      id: job.id,
      progress: {
        status: job.status,
        percentage: job.percentage || 0,
        estimatedTimeRemainingSec: job.estimated_time_remaining_sec,
        currentPage: job.current_page,
        totalPages: job.page_count,
      },
      metadata: {
        fileName: job.original_file_name,
        fileSize: job.file_size_bytes,
        pageCount: job.page_count,
        sourceLang: job.source_lang || 'auto',
        targetLang: job.target_lang,
        engineVersion: job.engine_version,
      },
      createdAt: job.created_at,
      updatedAt: job.updated_at,
    };
  }

  async cancelJob(jobId: string, userId: string) {
    await this.db.query(`UPDATE jobs SET status = 'canceled' WHERE id = $1 AND user_id = $2 AND status NOT IN ('completed', 'failed')`, [jobId, userId]);
    return { success: true };
  }
}
