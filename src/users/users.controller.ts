import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { User } from 'src/entities';
import { GetUser } from './decorators';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUserProfile(@Req() req) {
    return await this.usersService.getAllUserProfile(req);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('profile')
  async profile(@GetUser() user: User) {
    return user;
  }
}
