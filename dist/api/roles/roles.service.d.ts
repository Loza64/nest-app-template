import { DeepPartial, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { PaginationModel } from 'src/common/models/pagination.model';
import { ICrudService } from 'src/common/service/crud.service';
export declare class RolesService implements ICrudService<Role> {
    private readonly roleRepo;
    private readonly permRepo;
    constructor(roleRepo: Repository<Role>, permRepo: Repository<Permission>);
    create(dto: DeepPartial<Role> & {
        permissions?: {
            id: number;
        }[];
    }): Promise<Role>;
    update({ id, dto, }: {
        id: number;
        dto: DeepPartial<Role> & {
            permissions?: {
                id: number;
            }[];
        };
    }): Promise<Role>;
    delete(id: number): Promise<Role>;
    softDelete(id: number): Promise<Role>;
    restore(id: number): Promise<Role>;
    findOneBy(params: {
        filters: FindOptionsWhere<Role> | FindOptionsWhere<Role>[];
        relations?: FindOptionsRelations<Role>;
    }): Promise<Role>;
    findBy(params: {
        filters: FindOptionsWhere<Role> | FindOptionsWhere<Role>[];
        relations?: FindOptionsRelations<Role>;
        page: number;
        size: number;
    }): Promise<PaginationModel<Role>>;
    count(filters?: FindOptionsWhere<Role> | FindOptionsWhere<Role>[]): Promise<number>;
}
