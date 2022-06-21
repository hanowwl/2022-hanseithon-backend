import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('team')
export class Team extends BaseEntity {
  @Column('varchar', { unique: true })
  name: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'members' })
  members: User[];

  @Column({ type: 'varchar', length: 6 })
  invite_code: string;
}
