import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SetMetadata } from '@nestjs/common';

const Public = () => SetMetadata('isPublic', true);

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    async signIn(@Body() signInDto: Record<string, any>) {
      return await this.authService.signIn(signInDto.email, signInDto.password);
    }
  
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @Public()
    async refresh(@Body() refreshDto: Record<string, any>, @Res() res) {
        try {
            return await this.authService.refreshToken(refreshDto.accessToken, refreshDto.refreshToken);    
        } catch(err) {
            return res.redirect(HttpStatus.PERMANENT_REDIRECT, '/auth/login')
        }

    }
}
