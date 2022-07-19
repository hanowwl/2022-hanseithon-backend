import { UPLOAD_FILE_TYPE, UPLOAD_FILE_TYPE_VALUES } from 'src/constants';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeamMember } from './team-member.entity';
import { Team } from './team.entity';

@Entity()
export class File extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'enum', enum: UPLOAD_FILE_TYPE_VALUES })
  type: UPLOAD_FILE_TYPE;

  @ManyToOne(() => TeamMember, (member) => member.id, { onDelete: 'SET NULL' })
  uploader: TeamMember;

  @ManyToOne(() => Team, (team) => team.id, { onDelete: 'SET NULL' })
  team: Team;
}
