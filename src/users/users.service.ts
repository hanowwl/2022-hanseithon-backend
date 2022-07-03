import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUser(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }

    throw new HttpException(
      'id에 해당하는 유저가 없습니다.',
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteUser(username: string) {
    return await this.userRepository.delete(username);
  }
}
