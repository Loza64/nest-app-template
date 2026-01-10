import { Injectable, OnApplicationBootstrap, RequestMethod } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
import { DeepPartial } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

@Injectable()
export class PermissionsSeeder implements OnApplicationBootstrap {
    private readonly unrequirePaths = [
        '/api/auth/login',
        '/api/auth/signup',
        '/api/auth/profile',
    ];

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
        private readonly discoveryService: DiscoveryService,
        private readonly reflector: Reflector,
        private readonly permissionsService: PermissionsService,
    ) { }

    private normalizePath(path: string) {
        return path.replace(/\/+$/, '');
    }

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
                    const methodNum = this.reflector.get<number>(METHOD_METADATA, handler);

                    if (!routePath || methodNum === undefined) return;

                    let fullPath = `/${controllerPath}/${routePath}`.replace(/\/+/g, '/');
                    fullPath = this.normalizePath(fullPath);

                    const isPublic = this.unrequirePaths.some(p => fullPath.startsWith(this.normalizePath(p)));
                    if (isPublic || !fullPath.trim()) return;

                    permissions.push({
                        path: fullPath,
                        method: this.methodMap[methodNum],
                    });
                });
        });

        for (const perm of permissions) {
            await this.permissionsService.create(perm);
        }
    }
}
