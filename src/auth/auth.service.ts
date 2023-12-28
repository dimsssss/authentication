import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './dto/auth.response';
import { ConfigService } from '@nestjs/config';
import { InvalidException } from './exception/auth.invalid-exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signIn(email, pass) : Promise<Auth> {
    try {
      const user = await this.usersService.findOneBy(email);

      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }
  
      const accessToken = await this.jwtService.signAsync({ userId: user.id, username: user.firstname, type: 'access' }, { expiresIn : '1h', secret: this.configService.get('SECRET')})
      const refreshToken = await this.jwtService.signAsync({ userId: user.id, username: user.firstname, type: 'refresh', accessToken }, { expiresIn : '30d', secret: this.configService.get('SECRET')})    
  
      return new Auth(accessToken, refreshToken, user.id, user.lastname)
    } catch(err) {
      throw err
    }
  }

  async refreshToken(accessToken, prevRefreshToken) : Promise<Auth> {
    try {
      const payload = await this.jwtService.verifyAsync(prevRefreshToken,{secret: this.configService.get('SECRET')});

      if (accessToken !== payload.accessToken) {
        throw new InvalidException('Invalid access Token')
      }
  
      if (prevRefreshToken !== payload.refreshToken) {
        throw new InvalidException('Invalid Refresh Token')
      }
      
      const newAccessToken = this.jwtService.signAsync({ userId: payload.id, username: payload.username, type: 'access' }, { expiresIn : '1h'})
      const newRefreshToken = this.jwtService.signAsync({ userId: payload.id, username: payload.username, type: 'refresh', newAccessToken }, { expiresIn : '30d'})    
  
      return new Auth(newAccessToken, newRefreshToken, payload.id, payload.username)
    } catch(error) {
      throw error
    }
  }
}