import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { PaginationModel } from 'src/common/models/pagination-model';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permRepo: Repository<Permission>,
    ) { }


    async create(dto: DeepPartial<Role> & { permissions?: { id: number }[] }): Promise<Role> {
        let permissions: Permission[] = [];

        if (dto.permissions?.length) {
            const ids = dto.permissions.map(p => p.id);
            permissions = await this.permRepo.findBy({ id: In(ids) });
            if (permissions.length !== ids.length) {
                throw new NotFoundException('Some permissions not found');
            }
        }

        const role = this.roleRepo.create({
            ...dto,
            permissions,
        });

        return this.roleRepo.save(role);
    }

    async update({ id, dto }: { id: number; dto: DeepPartial<Role> & { permissions?: { id: number }[] } }): Promise<Role> {
        const role = await this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
        if (!role) throw new NotFoundException('Role not found');

        Object.entries(dto).forEach(([key, value]) => {
            if (key !== 'permissions' && value !== undefined) {
                role[key] = value ?? role[key];
            }
        });

        if (dto.permissions) {
            const ids = dto.permissions.map(p => p.id);
            const permissions = await this.permRepo.findBy({ id: In(ids) });
            if (permissions.length !== ids.length) {
                throw new NotFoundException('Some permissions not found');
            }
            role.permissions = permissions;
        }

        return this.roleRepo.save(role);
    }

    async delete({ id }: { id: number }): Promise<void> {
        const role = await this.findOneBy({ filters: { id } });
        await this.roleRepo.remove(role);
    }

    async findOneBy({ filters, relations }: { filters: FindOptionsWhere<Role> | FindOptionsWhere<Role>[]; relations?: FindOptionsRelations<Role> }): Promise<Role> {
        const role = await this.roleRepo.findOne({ where: filters, relations });
        if (!role) throw new NotFoundException('Role not found');
        return role;
    }

    async findBy({ filters, relations, page, size }: { filters: FindOptionsWhere<Role> | FindOptionsWhere<Role>[]; relations?: FindOptionsRelations<Role>; page: number; size: number }): Promise<PaginationModel<Role>> {
        const result = await paginate<Role>(
            this.roleRepo,
            { page, limit: size },
            { where: filters, relations },
        );

        return new PaginationModel<Role>(
            result.items,
            result.meta.currentPage,
            result.meta.itemsPerPage,
            result.meta.totalPages ?? 1,
            result.meta.totalItems ?? 0,
        );
    }
}
