import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationModel } from 'src/common/models/pagination-model';
import { ICrudService } from 'src/common/service/crud.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class UsersService implements ICrudService<User> {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    ) { }

    async login(identifier: string): Promise<User | null> {
        const user = await this.userRepo.findOne({
            where: [
                { username: identifier, deletedAt: IsNull() },
                { email: identifier, deletedAt: IsNull() }
            ],
            relations: {
                role: true,
            }
        });
        return user;
    }

    async findAuth(id: number): Promise<User | null> {
        const user = await this.userRepo.findOne({
            where: { id }, relations: {
                role: {
                    permissions: true
                }
            }
        });
        return user;
    }

    async create(dto: DeepPartial<User>): Promise<User> {
        let role: Role | null = null;

        if (dto.role?.id) {
            role = await this.roleRepo.findOne({ where: { id: dto.role.id } });
            if (!role) throw new NotFoundException('Role not found');
        }

        const user = this.userRepo.create({ ...dto, role });
        return this.userRepo.save(user);
    }

    async update({ id, dto }: { id: number; dto: DeepPartial<User> }): Promise<User> {
        const user = await this.findOneBy({ filters: { id } });

        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined) user[key] = value;
        });

        if (dto.role?.id) {
            const roleEntity = await this.roleRepo.findOne({ where: { id: dto.role.id } });
            if (!roleEntity) throw new NotFoundException('Role not found');
            user.role = roleEntity;
        }

        return this.userRepo.save(user);
    }

    async delete(id: number): Promise<User> {
        const user = await this.findOneBy({ filters: { id } });
        if (!user) throw new NotFoundException('User not found');
        await this.userRepo.remove(user);
        return user;
    }

    async softDelete(id: number): Promise<User> {
        const user = await this.findOneBy({ filters: { id } });
        user.deletedAt = new Date();
        return this.userRepo.save(user);
    }

    async restore(id: number): Promise<User> {
        const user = await this.findOneBy({ filters: { id } });
        user.deletedAt = null;
        return this.userRepo.save(user);
    }

    async findOneBy(params: { filters: FindOptionsWhere<User> | FindOptionsWhere<User>[]; relations?: FindOptionsRelations<User> }): Promise<User> {
        const user = await this.userRepo.findOne({ where: params.filters, relations: params.relations });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findBy(params: { filters: FindOptionsWhere<User> | FindOptionsWhere<User>[]; relations?: FindOptionsRelations<User>; page: number; size: number }): Promise<PaginationModel<User>> {
        const result = await paginate<User>(this.userRepo, { page: params.page, limit: params.size }, { where: params.filters, relations: params.relations });
        return new PaginationModel<User>(
            result.items,
            result.meta.currentPage,
            result.meta.itemsPerPage,
            result.meta.totalPages ?? 1,
            result.meta.totalItems ?? 0,
        );
    }

    async count(filters?: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<number> {
        return this.userRepo.count({ where: filters });
    }
}
