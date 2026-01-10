import { Role } from './role.entity';
import { BaseEntity } from 'src/common/entity/base';
export declare class User extends BaseEntity {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    blocked: boolean;
    role: Role | null;
    encryptPassword(): Promise<void>;
}
