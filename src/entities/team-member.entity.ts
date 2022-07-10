import {
  TEAM_MEMBER_POSITION_TYPE,
  TEAM_MEMBER_POSITION_VALUES,
} from 'src/constants/type';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity('team_member')
export class TeamMember extends BaseEntity {
  @Column({ type: 'enum', enum: TEAM_MEMBER_POSITION_VALUES })
  position: TEAM_MEMBER_POSITION_TYPE;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
