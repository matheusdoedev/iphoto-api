import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Photo } from 'src/modules/photos/entities/photo.entity';

@Entity({ name: 'albums' })
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @ManyToOne(() => User, (user) => user.albums)
  user: User;

  @OneToMany(() => Photo, (photo) => photo.album, { nullable: true })
  photos?: Photo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
