import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString, IsEmail } from 'class-validator';

import { CarbonCertificates } from './CarbonCertificates';

@Entity('users')
export class Users extends BaseEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column()
  password: string;

  @OneToMany(() => CarbonCertificates, (certificate) => certificate.user, { onDelete: 'SET NULL' })
  certificates: CarbonCertificates[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
