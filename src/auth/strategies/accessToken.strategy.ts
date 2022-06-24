import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccesstokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    public readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    console.log(payload, payload.sub);
    return this.usersService.getById(payload.sub);
  }
}