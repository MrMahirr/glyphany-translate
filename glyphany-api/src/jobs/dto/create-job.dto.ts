import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'The PDF file to translate' })
  file: any;

  @ApiProperty({ description: 'Target language code (e.g. TR, EN, DE)', example: 'TR' })
  target_lang: string;
}
