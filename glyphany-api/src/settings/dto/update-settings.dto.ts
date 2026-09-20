import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  defaultTargetLang?: string;

  @IsOptional()
  @IsString()
  defaultEngine?: string;

  @IsOptional()
  @IsString()
  formality?: string;

  @IsOptional()
  @IsBoolean()
  autoDetectLang?: boolean;

  @IsOptional()
  @IsBoolean()
  bilingualDiagrams?: boolean;

  @IsOptional()
  @IsBoolean()
  latexRendering?: boolean;

  @IsOptional()
  @IsBoolean()
  glossaryExtraction?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
}
