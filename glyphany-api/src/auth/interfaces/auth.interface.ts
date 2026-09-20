export interface IAuthService {
  register(dto: any): Promise<any>;
  login(dto: any): Promise<any>;
  refreshToken(token: string): Promise<any>;
  getProfile(userId: string): Promise<any>;
  logout(userId: string): Promise<void>;
}
