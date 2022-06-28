import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    public readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new HttpException(
        '아이디와 패스워드가 올바르지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async register(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      phone,
      name,
      studentDepartment,
      studentGrade,
      studentClassroom,
      studentNumber,
      networkVerified,
    } = createUserDto;
    const salts = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salts);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      phone,
      name,
      studentDepartment,
      studentGrade,
      studentClassroom,
      studentNumber,
      networkVerified,
    });
    try {
      await this.userRepository.save(user);
      return user ? { success: true } : { success: false };
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException({
          success: false,
          message:
            '해당 아이디로 가입할 수 없습니다. 해당 아이디는 현재 이용 중인 아이디입니다.',
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async generateAccessToken(id: number) {
    const [access_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: parseInt(
            this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
          ),
        },
      ),
    ]);
    return access_token;
  }
  async generateRefreshToken(id: number) {
    const [refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id },
        {
          secret: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_SECRET_KEY',
          ),
          expiresIn: parseInt(
            this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
          ),
        },
      ),
    ]);
    return refreshToken;
  }
}
