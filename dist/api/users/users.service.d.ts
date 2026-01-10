import { DeepPartial, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationModel } from 'src/common/models/pagination.model';
import { ICrudService } from 'src/common/service/crud.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
export declare class UsersService implements ICrudService<User> {
    private readonly userRepo;
    private readonly roleRepo;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>);
    login(identifier: string): Promise<User | null>;
    findAuth(id: number): Promise<User | null>;
    create(dto: DeepPartial<User>): Promise<User>;
    update({ id, dto, }: {
        id: number;
        dto: DeepPartial<User>;
    }): Promise<User>;
    delete(id: number): Promise<User>;
    softDelete(id: number): Promise<User>;
    restore(id: number): Promise<User>;
    findOneBy(params: {
        filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];
        relations?: FindOptionsRelations<User>;
    }): Promise<User>;
    findBy(params: {
        filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];
        relations?: FindOptionsRelations<User>;
        page: number;
        size: number;
    }): Promise<PaginationModel<User>>;
    count(filters?: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<number>;
}
