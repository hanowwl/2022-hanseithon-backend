import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { TeamsService } from 'src/teams/teams.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly teamService: TeamsService,
  ) {}

  public async getUserProfile(id: string) {
    const user = await this.findUserById(id);
    const team = await this.teamService.findTeamByMemberId(user.id);
    return {
      ...user,
      team: team || null,
    };
  }

  public async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('유저 정보를 찾을 수 없어요');
    return user;
  }

  public async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException('유저 정보를 찾을 수 없어요');
    return user;
  }

  public async deleteUserByUsername(username: string) {
    return await this.userRepository.delete(username);
  }
}
