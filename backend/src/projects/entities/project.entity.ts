import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Investment } from '../../investments/entities/investment.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

export enum ProjectStatus {
  DRAFT = 'draf',
  PENDING_APPROVAL = 'menunggu persetujuan',
  ACTIVE = 'pendanaan aktif',
  FUNDED = 'terdanai',
  COMPLETED = 'selesai',
  REJECTED = 'ditolak',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 200 })
  tagline: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  fundingTarget: number;

  @Column({ default: 0 })
  amountRaised: number;

  @Column()
  durationInDays: number;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ length: 50 })
  category: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({ nullable: true, type: 'text' })
  investmentScheme: string;

  @Column({ nullable: true, type: 'text' })
  risks: string;

  @Column({ nullable: true, type: 'text' })
  teamInfo: string;

  @Column({ nullable: true })
  proposalUrl: string;

  @Column({ nullable: true })
  presentationUrl: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Investment, investment => investment.project)
  investments: Investment[];

  @OneToMany(() => Wishlist, wishlist => wishlist.project)
  wishlists: Wishlist[];

  @Column({ nullable: true, type: 'jsonb' })
  updates: any[];
}
