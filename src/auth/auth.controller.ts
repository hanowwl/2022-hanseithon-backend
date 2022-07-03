import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/entities';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard, RefreshTokenAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User) {
    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(@GetUser() user: User) {
    const accessToken = await this.authService.generateAccessToken(user.id);
    return { accessToken };
  }
}
