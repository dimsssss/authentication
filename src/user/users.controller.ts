import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getHello(@Request() req): Promise<User[]> {
    return await this.usersService.findAll()
  }
}
