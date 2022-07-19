import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, TeamMember, User } from 'src/entities';
import { TeamsModule } from 'src/teams/teams.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenStrategy,
  LocalStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
          signOptions: {
            expiresIn: parseInt(
              configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
            ),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User, TeamMember, File]),
    TeamsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
