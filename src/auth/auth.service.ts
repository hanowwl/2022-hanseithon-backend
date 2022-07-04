import {
  BadRequestException,
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

  private hash(data: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(data, salt);
  }

  public async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
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

  public async register(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      passwordCheck,
      phone,
      name,
      studentClassroom,
      studentDepartment,
      studentGrade,
      studentNumber,
    } = createUserDto;

    try {
      if (password !== passwordCheck)
        throw new BadRequestException('입력한 비밀번호가 서로 같지 않아요');

      const isAlreadyExistUser = await this.userRepository.count({
        where: [{ username }, { phone }],
      });

      if (isAlreadyExistUser)
        throw new ConflictException('이미 사용 중인 아이디 또는 전화번호에요');

      const user = this.userRepository.create({
        username,
        password: this.hash(password),
        phone,
        name,
        studentClassroom,
        studentDepartment,
        studentGrade,
        studentNumber,
        networkVerified: false,
      });

      await this.userRepository.save(user);

      return '';
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }

  public async generateAccessToken(id: string) {
    const [accessToken] = await Promise.all([
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
    return accessToken;
  }

  public async generateRefreshToken(id: string) {
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
