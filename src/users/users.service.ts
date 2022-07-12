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

  private async formatAllUserForResponse(teamMembers: TeamMember[]) {
    const formatAllUserData = (member: User | TeamMember) => {
      const user = member instanceof User ? member : member.user;
      return {
        name: user.name,
      };
    };

    return teamMembers.map((teamMember) => {
      return {
        user: {
          position: teamMember.position,
          name: teamMember.user.name,
          studentDepartment: teamMember.user.studentDepartment,
        },
        team: {
          createdAt: teamMember.team.createdAt,
          name: teamMember.team.name,
          description: teamMember.team.description,
          type: teamMember.team.type,
          owner: formatAllUserData(teamMember.team.owner),
          members: teamMember.team.members.map((member) => {
            return formatAllUserData(member.user);
          }),
        },
      };
    });
  }

  private async formatSecretAllUserForResponse(teamMembers: TeamMember[]) {
    const formatAllUserData = (member: User | TeamMember) => {
      const user = member instanceof User ? member : member.user;
      const secretName = this.maskingName(user.name);
      return secretName;
    };

    return teamMembers.map((teamMember) => {
      return {
        user: {
          position: teamMember.position,
          name: formatAllUserData(teamMember),
          studentDepartment: '비밀',
        },
        team: {
          createdAt: teamMember.team.createdAt,
          name: teamMember.team.name,
          description: teamMember.team.description,
          type: teamMember.team.type,
          owner: { name: formatAllUserData(teamMember.team.owner) },
          members: teamMember.team.members.map((member) => {
            return { name: formatAllUserData(member.user) };
          }),
        },
      };
    });
  }

  public async getAllUserProfile(req) {
    const allUser = await this.teamMemberRepository.find({
      select: ['id', 'position'],
      relations: ['user', 'team', 'team.members.user', 'team.owner'],
      order: {
        team: {
          createdAt: 'DESC',
        },
      },
    });
    const accessToken = req.get('authorization');
    if (accessToken === undefined) {
      return this.formatSecretAllUserForResponse(allUser);
    } else {
      const base64Payload = accessToken
        .replace('Bearer', '')
        .trim()
        .split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64');
      const result = JSON.parse(payload.toString());
      this.findUserById(result.sub);
      return this.formatAllUserForResponse(allUser);
    }
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

  public maskingName(name) {
    if (name.length > 2) {
      const originName = name.split('');
      originName.forEach((name, i) => {
        if (i === 0 || i === originName.length - 1) return;
        originName[i] = '*';
      });
      const joinName = originName.join();
      return joinName.replace(/,/g, '');
    } else {
      const pattern = /.$/;
      return name.replace(pattern, '*');
    }
  }
}
