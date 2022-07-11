import { Body, Controller, Ip, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/entities';
import { GetUser } from '../users/decorators';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AccessTokenAuthGuard,
  LocalAuthGuard,
  RefreshTokenAuthGuard,
} from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User, @Ip() ip: string) {
    return this.authService.login(user, ip);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(@GetUser() user: User) {
    const accessToken = await this.authService.generateAccessToken(user.id);
    return { accessToken };
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('internal-auth')
  async checkInternalAuth(@GetUser() user: User, @Ip() clientIp: string) {
    return this.authService.checkIsInternalNetwork(user, clientIp);
  }
}
