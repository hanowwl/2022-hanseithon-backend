import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Team } from './team.entity';

@Entity()
@Unique(['username', 'phone'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 16 })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 11 })
  phone: string;

  @Column({ type: 'varchar', length: 4 })
  name: string;

  @Column({ type: 'varchar', name: 'student_department' })
  studentDepartment: string;

  @Column({ type: 'int', name: 'student_grade', precision: 1 })
  studentGrade: number;

  @Column({ type: 'int', name: 'student_classroom', precision: 1 })
  studentClassroom: number;

  @Column({ type: 'int', name: 'student_number', precision: 2 })
  studentNumber: number;

  @Column({ type: 'tinyint', name: 'network_verified', default: 0 })
  networkVerified: boolean;

  @Column({
    type: 'timestamp',
    name: 'last_login_at',
    default: null,
    nullable: true,
  })
  lastLoginAt: Date | null;

  @Column({
    type: 'varchar',
    name: 'last_login_ip',
    default: null,
    nullable: true,
  })
  lastLoginIp: string | null;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
