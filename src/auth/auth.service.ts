import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './dto/auth.response';
import { ConfigService } from '@nestjs/config';

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

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync({ userId: user.id, username: user.firstname}, { expiresIn : '1h', secret: this.configService.get('ACCESS_SECRET')}),
        this.jwtService.signAsync({ userId: user.id, username: user.firstname}, { expiresIn : '30d', secret: this.configService.get('REFRESH_SECRET')})
      ])

      return new Auth(accessToken, refreshToken, user.id, user.lastname)
    } catch(err) {
      throw err
    }
  }

  async refreshToken(prevRefreshToken) : Promise<Auth> {
    try {
      const payload = await this.jwtService.verifyAsync(prevRefreshToken,{secret: this.configService.get('REFRESH_SECRET')});
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync({ userId: payload.userId, username: payload.username}, { expiresIn : '1h', secret: this.configService.get('ACCESS_SECRET')}),
        this.jwtService.signAsync({ userId: payload.userId, username: payload.username}, { expiresIn : '30d', secret: this.configService.get('REFRESH_SECRET')})
      ])
      
      return new Auth(newAccessToken, newRefreshToken, payload.userId, payload.username)
    } catch(error) {
      console.error(error)
      throw error
    }
  }
}
