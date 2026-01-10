import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';
import { BaseEntity } from 'src/common/entity/base';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true, length: 50 })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[];
}
