import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { User } from 'src/entities';

@Controller('users')
export class UsersController {
  @UseGuards(AccessTokenAuthGuard)
  @Get('profile')
  async profile(@GetUser() user: User) {
    return user;
  }
}
