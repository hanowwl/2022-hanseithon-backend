import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private hash(data: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(data, salt);
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
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }
}
