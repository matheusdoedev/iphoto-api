import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar', select: false })
  password: string;

  @Column({ nullable: false, type: 'varchar' })
  salt: string;

  @Column({ nullable: false, type: 'boolean' })
  accepted_terms: boolean;
}
