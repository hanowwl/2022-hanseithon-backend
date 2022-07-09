import { TEAM_TYPE, TEAM_TYPE_VALUES } from 'src/constants/type';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeamMember } from './team-member.entity';
import { User } from './user.entity';

@Entity('team')
@Unique(['name'])
export class Team extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];

  @Column({ type: 'varchar', length: 6, name: 'invite_code' })
  inviteCode: string;

  @Column({ type: 'enum', enum: TEAM_TYPE_VALUES })
  type: TEAM_TYPE;
}
