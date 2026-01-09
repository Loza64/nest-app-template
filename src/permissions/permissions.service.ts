import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { PaginationModel } from 'src/common/models/pagination-model';
import { paginate } from 'nestjs-typeorm-paginate';
import { Permission } from 'src/entities/permission.entity';

@Injectable()
export class PermissionsService {

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
    ) { }

    async save(dtos: DeepPartial<Permission>[]): Promise<Permission[]> {
        if (!dtos.length) return [];

        const existing = await this.permissionRepo.find({
            where: dtos.map(p => ({ path: p.path, method: p.method })),
        });

        const toCreate = dtos.filter(
            dto => !existing.some(item => item.path === dto.path && item.method === dto.method),
        );

        if (!toCreate.length) return existing;

        const created = this.permissionRepo.create(toCreate);
        return this.permissionRepo.save(created);
    }

    async update(id: number, title: string): Promise<Permission> {
        const permission = await this.findOneBy({ filters: { id }, relations: {} });
        permission.title = title;
        return this.permissionRepo.save(permission);
    }

    async findOneBy({
        filters,
        relations,
    }: {
        filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
        relations?: FindOptionsRelations<Permission>;
    }): Promise<Permission> {
        const permission = await this.permissionRepo.findOne({ where: filters, relations });
        if (!permission) throw new NotFoundException('Permission not found');
        return permission;
    }

    async findBy({
        filters,
        relations,
        page,
        size,
    }: {
        filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
        relations?: FindOptionsRelations<Permission>;
        page: number;
        size: number;
    }): Promise<PaginationModel<Permission>> {
        const result = await paginate<Permission>(
            this.permissionRepo,
            { page, limit: size },
            { where: filters, relations },
        );

        return new PaginationModel<Permission>(
            result.items,
            result.meta.currentPage,
            result.meta.itemsPerPage,
            result.meta.totalPages ?? 1,
            result.meta.totalItems ?? 0,
        );
    }
}
