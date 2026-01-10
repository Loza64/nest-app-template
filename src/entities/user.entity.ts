import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';
import { BaseEntity } from 'src/common/entity/base';

@Entity('users')
export class User extends BaseEntity {

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  surname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false })
  blocked: boolean;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword(): Promise<void> {
    if (this.password && !this.password.startsWith('$2')) {
      const hashedPassword: string = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
  }
}
