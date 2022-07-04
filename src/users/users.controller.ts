import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { User } from 'src/entities';
import { GetUser } from 'src/users/decorators';

@Controller('users')
export class UsersController {
  @UseGuards(AccessTokenAuthGuard)
  @Get('profile')
  async profile(@GetUser() user: User) {
    return user;
  }
}
