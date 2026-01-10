import { Repository, DeepPartial, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { PaginationModel } from 'src/common/models/pagination.model';
import { Permission } from 'src/entities/permission.entity';
export declare class PermissionsService {
    private readonly permissionRepo;
    constructor(permissionRepo: Repository<Permission>);
    create(dto: DeepPartial<Permission>): Promise<Permission>;
    update({ id, dto, }: {
        id: number;
        dto: DeepPartial<Permission>;
    }): Promise<Permission>;
    findOneBy(params: {
        filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
        relations?: FindOptionsRelations<Permission>;
    }): Promise<Permission>;
    findBy(params: {
        filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
        relations?: FindOptionsRelations<Permission>;
        page: number;
        size: number;
    }): Promise<PaginationModel<Permission>>;
    count(filters?: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[]): Promise<number>;
}
