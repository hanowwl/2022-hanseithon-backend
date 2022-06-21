import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user', { schema: 'hanseithon' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username' })
  username: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @Column('varchar', { name: 'phone' })
  phone: string;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('varchar', { name: 'student_department' })
  studentDepartment: string;

  @Column('int', { name: 'student_grade' })
  studentGrade: number;

  @Column('int', { name: 'student_number' })
  studentNumber: number;

  @Column('tinyint', { name: 'network_verified' })
  networkVerified: number;

  @Column('timestamp', {
    name: 'last_login_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLoginAt: Date;

  @Column('varchar', { name: 'last_login_ip' })
  lastLoginIp: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deletedAt: Date;
}
