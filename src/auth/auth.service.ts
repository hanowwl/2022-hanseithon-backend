import {
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
    } = createUserDto;
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      phone,
      name,
      studentDepartment,
      studentGrade,
      studentClassroom,
      studentNumber,
      networkVerified: false,
    });

    try {
      await this.userRepository.save(user);
      return { success: true, message: '', result: '' };
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
}
