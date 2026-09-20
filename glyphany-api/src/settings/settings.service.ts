import { Injectable, Inject } from '@nestjs/common';
import { IDatabaseService } from '../database/interfaces/database.interface';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('IDatabaseService') private readonly db: IDatabaseService,
  ) {}

  async getSettings(userId: string) {
    const rows = await this.db.query(
      `SELECT 
        default_target_lang as "defaultTargetLang",
        default_engine as "defaultEngine",
        formality,
        auto_detect_lang as "autoDetectLang",
        bilingual_diagrams as "bilingualDiagrams",
        latex_rendering as "latexRendering",
        glossary_extraction as "glossaryExtraction",
        email_notifications as "emailNotifications"
       FROM user_settings 
       WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      // Create default settings if not exists
      const insertQuery = `
        INSERT INTO user_settings (user_id) VALUES ($1)
        RETURNING 
          default_target_lang as "defaultTargetLang",
          default_engine as "defaultEngine",
          formality,
          auto_detect_lang as "autoDetectLang",
          bilingual_diagrams as "bilingualDiagrams",
          latex_rendering as "latexRendering",
          glossary_extraction as "glossaryExtraction",
          email_notifications as "emailNotifications"
      `;
      const newRows = await this.db.query(insertQuery, [userId]);
      return newRows[0];
    }

    return rows[0];
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    // First ensure settings exist
    await this.getSettings(userId);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        // Convert camelCase to snake_case for db columns
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.getSettings(userId);
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const updateQuery = `
      UPDATE user_settings 
      SET ${fields.join(', ')} 
      WHERE user_id = $${paramIndex}
      RETURNING 
        default_target_lang as "defaultTargetLang",
        default_engine as "defaultEngine",
        formality,
        auto_detect_lang as "autoDetectLang",
        bilingual_diagrams as "bilingualDiagrams",
        latex_rendering as "latexRendering",
        glossary_extraction as "glossaryExtraction",
        email_notifications as "emailNotifications"
    `;

    const result = await this.db.query(updateQuery, values);
    return result[0];
  }
}
