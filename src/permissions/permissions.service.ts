import { Injectable, NotFoundException, OnApplicationBootstrap, RequestMethod } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { PaginationModel } from 'src/common/models/pagination-model';
import { paginate } from 'nestjs-typeorm-paginate';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

@Injectable()
export class PermissionsService implements OnApplicationBootstrap {

    private readonly publicPaths = [
        '/api/auth/login',
        '/api/auth/signup',
        '/api/auth/profile',
    ]

    private readonly methodMap: Record<number, string> = {
        [RequestMethod.GET]: 'GET',
        [RequestMethod.POST]: 'POST',
        [RequestMethod.PUT]: 'PUT',
        [RequestMethod.DELETE]: 'DELETE',
        [RequestMethod.PATCH]: 'PATCH',
        [RequestMethod.OPTIONS]: 'OPTIONS',
        [RequestMethod.HEAD]: 'HEAD',
        [RequestMethod.ALL]: 'ALL',
    };


    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        private readonly discoveryService: DiscoveryService,
        private readonly reflector: Reflector,
    ) { }

    async onApplicationBootstrap() {
        const controllers = this.discoveryService.getControllers();
        const permissions: DeepPartial<Permission>[] = [];

        controllers.forEach(wrapper => {
            const { instance } = wrapper;
            if (!instance) return;

            const prototype = Object.getPrototypeOf(instance);
            const controllerPath = this.reflector.get<string>(PATH_METADATA, instance.constructor) || '';

            Object.getOwnPropertyNames(prototype)
                .filter(m => typeof instance[m] === 'function' && m !== 'constructor')
                .forEach(methodName => {
                    const handler = prototype[methodName];
                    const routePath = this.reflector.get<string>(PATH_METADATA, handler);
                    const requestMethodNum = this.reflector.get<number>(METHOD_METADATA, handler);

                    if (routePath && requestMethodNum !== undefined) {
                        let fullPath = `${controllerPath}/${routePath}`.replace(/\/+/g, '/');

                        if (fullPath.endsWith('/') && !fullPath.includes(':')) {
                            fullPath = fullPath.slice(0, -1);
                        }

                        if (fullPath.trim() === '' || this.publicPaths.includes(fullPath)) return;

                        permissions.push({
                            path: fullPath,
                            method: this.methodMap[requestMethodNum]
                        });
                    }
                });
        });

        await this.save(permissions);
    }

    async save(dtos: DeepPartial<Permission>[]): Promise<Permission[]> {
        if (!dtos.length) return [];

        const existing = await this.permissionRepo.find({
            where: dtos.map(p => ({ path: p.path, method: p.method })),
        });

        const toCreate = dtos.filter(
            dto => !existing.some(e => e.path === dto.path && e.method === dto.method)
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

    async findOneBy({ filters, relations }: { filters: FindOptionsWhere<Permission>; relations?: FindOptionsRelations<Permission> }): Promise<Permission> {
        const user = await this.permissionRepo.findOne({ where: filters, relations });
        if (!user) throw new NotFoundException('Permission not found');
        return user;
    }

    async findBy({ filters, relations, page, size }: { filters: FindOptionsWhere<Permission>; relations?: FindOptionsRelations<Permission>; page: number; size: number }): Promise<PaginationModel<Permission>> {
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