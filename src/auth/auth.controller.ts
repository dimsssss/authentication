import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res
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

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @Public()
  async refresh(@Body() refreshDto: Record<string, any>, @Res() res) {
    try {
      const auth = await this.authService.refreshToken(refreshDto.refreshToken);
      return res.json(auth)
    } catch(error) {
      console.log(error)
      return res.redirect('/auth/login') 
    }
  }
}
