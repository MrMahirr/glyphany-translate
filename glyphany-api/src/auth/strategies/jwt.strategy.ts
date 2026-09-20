import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IAuthService } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-default-key-for-dev',
    });
  }

  async validate(payload: any) {
    // Validate if the user still exists
    try {
      const user = await this.authService.getProfile(payload.sub);
      return user; // Attached to Request as req.user
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
