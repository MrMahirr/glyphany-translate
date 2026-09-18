export interface IStorageService {
  uploadFile(bucket: string, key: string, file: Buffer, contentType: string): Promise<void>;
  getPresignedUrl(bucket: string, key: string, expiresInSeconds?: number): Promise<string>;
}
