import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../interfaces/auth.interface';
import { IPasswordHasher } from '../interfaces/password-hasher.interface';
import { IDatabaseService } from '../../database/interfaces/database.interface';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IDatabaseService') private readonly db: IDatabaseService,
    @Inject('IPasswordHasher') private readonly hasher: IPasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.db.query('SELECT id FROM users WHERE email = $1', [dto.email]);
    if (existingUser.length > 0) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await this.hasher.hash(dto.password);
    
    const result = await this.db.query(
      `INSERT INTO users (email, password_hash, full_name, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, email, full_name as "fullName", avatar_url as "avatarUrl", organization, role, created_at as "createdAt"`,
      [dto.email, passwordHash, dto.fullName, 'user']
    );

    const user = result[0];
    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<any> {
    const users = await this.db.query(
      `SELECT id, email, password_hash, full_name as "fullName", avatar_url as "avatarUrl", organization, role, created_at as "createdAt" 
       FROM users WHERE email = $1`,
      [dto.email]
    );

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];
    const isPasswordValid = await this.hasher.compare(dto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password_hash;
    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.getProfile(payload.sub);
      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string): Promise<any> {
    const users = await this.db.query(
      `SELECT id, email, full_name as "fullName", avatar_url as "avatarUrl", organization, role, created_at as "createdAt" 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (users.length === 0) {
      throw new UnauthorizedException('User not found');
    }

    return users[0];
  }

  async logout(userId: string): Promise<void> {
    // Stateless JWT, client is expected to delete the token.
    // In a stateful system we could blacklist the token here.
    return;
  }

  private generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 3600,
      user
    };
  }
}
