import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenAuthGuard } from 'src/auth/guards';
import { User } from 'src/entities';
import { GetUser } from 'src/users/decorators';
import { CreateTeamDto, JoinTeamDto, UpdateMemberPositionDto } from './dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':id')
  getUserTeam(@Param('id') id: string) {
    return this.teamsService.findTeamByMemberId(id);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post()
  createTeam(@GetUser() user: User, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(user, createTeamDto);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('join/:inviteCode')
  joinTeam(
    @GetUser() user: User,
    @Param('inviteCode') inviteCode: string,
    @Body() joinTeamDto: JoinTeamDto,
  ) {
    return this.teamsService.joinTeam(user, inviteCode, joinTeamDto);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Patch('/:teamId/members/:memberId/position')
  updateMemberPosition(
    @GetUser() user: User,
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberPositionDto: UpdateMemberPositionDto,
  ) {
    return this.teamsService.updateTeamMemberPosition(
      user,
      teamId,
      memberId,
      updateMemberPositionDto,
    );
  }
}
