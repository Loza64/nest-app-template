import { BaseEntity } from 'src/common/entity/base';
import { Entity, Column, Unique, } from 'typeorm';

@Entity('permissions')
@Unique(['path', 'method'])
export class Permission extends BaseEntity {

  @Column()
  path: string;

  @Column()
  method: string;

  @Column({ nullable: true })
  title?: string;
}
