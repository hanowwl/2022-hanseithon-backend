import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember, User } from 'src/entities';
import { TeamsService } from 'src/teams/teams.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TeamMember)
    public readonly teamMemberRepository: Repository<TeamMember>,
    public readonly teamService: TeamsService,
  ) {}

  private async formatAllUserForResponse(teamMember: TeamMember[]) {
    const formatAllUserData = (member: User | TeamMember) => {
      const user = member instanceof User ? member : member.user;
      return {
        name: user.name,
      };
    };

    return teamMember.map((user) => {
      return {
        position: user.position,
        user: {
          name: user.user.name,
          studentDepartment: user.user.studentDepartment,
        },
        team: {
          createdAt: user.team.createdAt,
          name: user.team.name,
          description: user.team.description,
          type: user.team.type,
          owner: formatAllUserData(user.team.owner),
          members: user.team.members.map((team) => {
            return formatAllUserData(team.user);
          }),
        },
      };
    });
  }

  public async getAllUserProfile() {
    const allUserProfile = await this.teamMemberRepository.find({
      select: ['id', 'position'],
      relations: ['user', 'team', 'team.members.user', 'team.owner'],
      order: {
        team: {
          createdAt: 'DESC',
        },
      },
    });

    return this.formatAllUserForResponse(allUserProfile);
  }

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
