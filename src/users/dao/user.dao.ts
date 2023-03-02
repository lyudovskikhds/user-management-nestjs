import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserDao {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  readonly id: number;

  @Column({ name: 'email', unique: true, length: '254' })
  readonly email: string;

  @Column({ name: 'first_name', length: '100' })
  readonly firstName: string;

  @Column({ name: 'last_name', length: '100' })
  readonly lastName: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  readonly deletedAt: Date | null;

  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }
}
