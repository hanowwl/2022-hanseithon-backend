import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team, User } from 'src/entities';
import { TeamMember } from 'src/entities/team-member.entity';
import { getRandomString } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateTeamDto, JoinTeamDto, UpdateMemberPositionDto } from './dto';

@Injectable()
export class TeamsService {
  private readonly MAX_JOIN_USERS_COUNT: number = 10;

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}

  private formatTeamNMembersForResponse(team: Team) {
    const formatUserData = (member: User | TeamMember) => {
      const user = member instanceof User ? member : member.user;
      return {
        id: user.id,
        name: user.name,
        studentClassroom: user.studentClassroom,
        studentDepartment: user.studentDepartment,
        studentGrade: user.studentGrade,
        studentNumber: user.studentNumber,
      };
    };

    return {
      ...team,
      owner: formatUserData(team.owner),
      members: team.members.map((member) => ({
        id: member.id,
        position: member.position,
        user: formatUserData(member.user),
      })),
    };
  }

  public async findTeamByMemberId(id: string) {
    const team = await this.teamRepository.findOne({
      where: [{ members: { user: { id } } }, { owner: { id } }],
    });
    return team;
  }

  public async findTeamByInviteCode(inviteCode: string, relations?: string[]) {
    const team = await this.teamRepository.findOne({
      where: { inviteCode },
      relations: relations || [],
    });
    return team;
  }

  public async isTeamOwner(teamId: string, user: User) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['owner'],
    });
    if (!team) throw new NotFoundException('팀 정보를 찾을 수 없어요');

    if (team.owner.id === user.id) return true;
    return false;
  }

  public async createTeam(user: User, createTeamDto: CreateTeamDto) {
    try {
      const { name, description, position, type } = createTeamDto;
      const userTeam = await this.findTeamByMemberId(user.id);
      if (userTeam) throw new BadRequestException('이미 소속 중인 팀이 있어요');

      const isAlreadyExistTeamName = await this.teamRepository.count({
        where: { name },
      });

      if (isAlreadyExistTeamName)
        throw new ConflictException('이미 사용 중인 팀명이에요');

      const team = this.teamRepository.create({
        name,
        description,
        owner: user,
        members: [],
        inviteCode: getRandomString(6),
        type,
      });
      await this.teamRepository.save(team);

      const member = this.teamMemberRepository.create({
        team,
        position,
        user: user,
      });
      await this.teamMemberRepository.save(member);

      const response = await this.teamRepository.findOne({
        where: { id: team.id },
        relations: ['owner', 'members', 'members.user'],
      });

      return this.formatTeamNMembersForResponse(response);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }

  public async joinTeam(
    user: User,
    inviteCode: string,
    joinTeamDto: JoinTeamDto,
  ) {
    try {
      const { position } = joinTeamDto;
      const userTeam = await this.findTeamByMemberId(user.id);
      if (userTeam) throw new BadRequestException('이미 소속 중인 팀이 있어요');

      const team = await this.findTeamByInviteCode(inviteCode, [
        'owner',
        'members',
        'members.user',
      ]);
      if (!team) throw new NotFoundException('잘못된 초대코드에요');
      if (team.members.length === this.MAX_JOIN_USERS_COUNT)
        throw new ConflictException('이미 최대 참가인원이 꽉 찼어요');

      const member = await this.teamMemberRepository.create({
        position: position,
        user: user,
        team: team,
      });

      team.members.push(member);

      await this.teamRepository.save(team);
      await this.teamMemberRepository.save(member);

      return this.formatTeamNMembersForResponse(team);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }

  public async updateTeamMemberPosition(
    user: User,
    teamId: string,
    memberId: string,
    updateMemberPositionDto: UpdateMemberPositionDto,
  ) {
    try {
      const isTeamOwner = await this.isTeamOwner(teamId, user);
      if (!isTeamOwner) throw new BadRequestException('잘못된 요청이에요');

      const { position } = updateMemberPositionDto;
      const member = await this.teamMemberRepository.findOne({
        where: { id: memberId },
      });
      if (!member) throw new NotFoundException('팀 멤버 정보를 찾을 수 없어요');

      member.position = position;
      this.teamMemberRepository.save(member);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }
}
