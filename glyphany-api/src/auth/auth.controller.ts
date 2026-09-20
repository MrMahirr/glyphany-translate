import { Controller, Post, Get, Body, Inject, UseGuards, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { IAuthService } from './interfaces/auth.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.userId || req.user.id);
    return { success: true };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth(@Req() req: any) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    // req.user will contain the validated user from GoogleStrategy
    const user = req.user;
    
    // We need to generate JWT for this user.
    // However, our `generateTokens` in AuthService is private. Let's create an `oauthLogin` or just make `login` accept a user directly, or create a specific method.
    // For simplicity, we can add a method `generateTokensForOAuth` in AuthService or just cast and call it.
    // Let's assume authService has a `generateOAuthTokens` or similar. Since we didn't add it, we can just do this:
    // Wait, let's add it to AuthService in the next step. For now, let's pretend authService has `loginOAuthUser`.
    
    const tokens = await (this.authService as any).generateTokens(user);
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/login?token=${tokens.accessToken}`);
  }
}
