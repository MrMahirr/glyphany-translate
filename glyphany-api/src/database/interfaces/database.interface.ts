export interface IDatabaseService {
  query<T = any>(text: string, params?: any[]): Promise<T[]>;
  execute(text: string, params?: any[]): Promise<void>;
  transaction<T>(callback: (client: IDatabaseClient) => Promise<T>): Promise<T>;
}

export interface IDatabaseClient {
  query<T = any>(text: string, params?: any[]): Promise<T[]>;
  execute(text: string, params?: any[]): Promise<void>;
}
