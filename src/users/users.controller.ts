import { Controller, Get, Ip, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { User } from 'src/entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenAuthGuard)
  @Get('all')
  async getAllUser() {
    return await this.usersService.getAllUser();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('profile')
  async profile(@GetUser() user: User) {
    return { success: true, message: '', result: user };
  }
}
