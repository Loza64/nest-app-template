import { DeepPartial, FindOneOptions, FindOptionsRelations, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { PaginationModel } from '../models/pagination-model';

export interface ICrudService<T extends ObjectLiteral> {
    create(dto: DeepPartial<T>): Promise<T>;

    update(params: { id: number; dto: DeepPartial<T>; options?: FindOneOptions<T> }): Promise<T>;

    delete(params: { id: number; options?: FindOneOptions<T> }): Promise<void>;

    findOneBy(params: { filters: FindOptionsWhere<T>, relations?: FindOptionsRelations<T> }): Promise<T>;

    findBy(params: { filters: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>, page: number, size: number }): Promise<PaginationModel<T>>;
}
