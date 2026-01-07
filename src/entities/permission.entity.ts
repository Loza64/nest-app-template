import { Entity, PrimaryGeneratedColumn, Column, Unique, } from 'typeorm';

@Entity('permissions')
@Unique(['path', 'method'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column({ nullable: true })
  title?: string;
}
