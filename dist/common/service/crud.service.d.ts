import { DeepPartial, FindOptionsRelations, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { PaginationModel } from '../models/pagination.model';
export interface ICrudService<T extends ObjectLiteral> {
    create(dto: DeepPartial<T>): Promise<T>;
    update(params: {
        id: number;
        dto: DeepPartial<T>;
    }): Promise<T>;
    delete(id: number): Promise<T>;
    softDelete(id: number): Promise<T>;
    restore(id: number): Promise<T>;
    findOneBy(params: {
        filters: FindOptionsWhere<T> | FindOptionsWhere<T>[];
        relations?: FindOptionsRelations<T>;
    }): Promise<T>;
    findBy(params: {
        filters: FindOptionsWhere<T> | FindOptionsWhere<T>[];
        relations?: FindOptionsRelations<T>;
        page: number;
        size: number;
    }): Promise<PaginationModel<T>>;
    count(filters?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number>;
}
