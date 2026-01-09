import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationModel } from 'src/common/models/pagination-model';
import { ICrudService } from 'src/common/service/crud.service';

@Injectable()
export class UsersService implements ICrudService<User> {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    ) { }

    async create(dto: DeepPartial<User>): Promise<User> {
        let roleEntity: Role | null = null;

        if (dto.role?.id) {
            roleEntity = await this.roleRepo.findOne({ where: { id: dto.role.id } });
            if (!roleEntity) throw new NotFoundException('Role not found');
        }

        const user = this.userRepo.create({
            ...dto,
            role: roleEntity,
        });

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

    async delete({ id }: { id: number }): Promise<void> {
        const user = await this.findOneBy({ filters: { id } });
        await this.userRepo.remove(user);
    }

    async findOneBy({ filters, relations }: { filters: FindOptionsWhere<User> | FindOptionsWhere<User>[]; relations?: FindOptionsRelations<User> }): Promise<User> {
        const user = await this.userRepo.findOne({ where: filters, relations });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findBy({ filters, relations, page, size }: { filters: FindOptionsWhere<User> | FindOptionsWhere<User>[]; relations?: FindOptionsRelations<User>; page: number; size: number }): Promise<PaginationModel<User>> {
        const result = await paginate<User>(
            this.userRepo,
            { page, limit: size },
            { where: filters, relations },
        );

        return new PaginationModel<User>(
            result.items,
            result.meta.currentPage,
            result.meta.itemsPerPage,
            result.meta.totalPages ?? 1,
            result.meta.totalItems ?? 0,
        );
    }
}
