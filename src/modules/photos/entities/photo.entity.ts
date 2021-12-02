import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Album } from 'src/modules/albums/entities/album.entity';

@Entity({ name: 'photos' })
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: true, type: 'varchar' })
  url?: string;

  @Column({ nullable: true, type: 'varchar' })
  image_key?: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @ManyToOne(() => Album, (album) => album.photos)
  album: Album;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
