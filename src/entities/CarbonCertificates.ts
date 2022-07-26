import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { CertificateStatus } from '../shared/constants/global.constants';
import { Users } from './Users';

@Entity('carbon_certificates')
export class CarbonCertificates extends BaseEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  country: string;

  @Column({
    type: 'enum',
    enum: CertificateStatus,
    default: CertificateStatus.AVAILABLE,
  })
  status: CertificateStatus;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'SET NULL' })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
