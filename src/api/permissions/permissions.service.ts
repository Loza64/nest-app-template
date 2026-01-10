import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationModel } from 'src/common/models/pagination.model';
import { Permission } from 'src/entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: DeepPartial<Permission>): Promise<Permission> {
    const existing = await this.permissionRepo.findOne({
      where: { path: dto.path, method: dto.method },
    });
    if (existing) return existing;

    const permission = this.permissionRepo.create(dto);
    return this.permissionRepo.save(permission);
  }

  async update({
    id,
    dto,
  }: {
    id: number;
    dto: DeepPartial<Permission>;
  }): Promise<Permission> {
    const permission = await this.findOneBy({ filters: { id } });
    Object.assign(permission, dto);
    return this.permissionRepo.save(permission);
  }

  async findOneBy(params: {
    filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
    relations?: FindOptionsRelations<Permission>;
  }): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({
      where: params.filters,
      relations: params.relations,
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async findBy(params: {
    filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
    relations?: FindOptionsRelations<Permission>;
    page: number;
    size: number;
  }): Promise<PaginationModel<Permission>> {
    const result = await paginate<Permission>(
      this.permissionRepo,
      { page: params.page, limit: params.size },
      { where: params.filters, relations: params.relations },
    );

    return new PaginationModel<Permission>(
      result.items,
      result.meta.currentPage,
      result.meta.itemsPerPage,
      result.meta.totalPages ?? 1,
      result.meta.totalItems ?? 0,
    );
  }

  async count(
    filters?: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[],
  ): Promise<number> {
    return this.permissionRepo.count({ where: filters });
  }
}
