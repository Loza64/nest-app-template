import { Permission } from './permission.entity';
import { BaseEntity } from 'src/common/entity/base';
export declare class Role extends BaseEntity {
    name: string;
    permissions: Permission[];
}
