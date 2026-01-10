import {
  Injectable,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { DeepPartial } from 'typeorm';

import { PermissionsService } from './permissions.service';
import { Permission } from 'src/entities/permission.entity';
import PathRule from 'src/common/models/path.rule';

@Injectable()
export class PermissionsSeeder implements OnApplicationBootstrap {
  private readonly unRequiredPaths: PathRule[] = [
    { path: '/api/auth/login', methods: ['POST'] },
    { path: '/api/auth/signup', methods: ['POST'] },
    { path: '/api/auth/profile', methods: ['GET', 'PUT'] },
  ];

  private readonly methodMap: Readonly<Partial<Record<RequestMethod, string>>> =
    {
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

  private normalizePath(path = ''): string {
    return `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  }

  private notRequired(path: string, method: string): boolean {
    return this.unRequiredPaths.some((rule) => {
      const rulePath = rule.path;
      return path === rulePath && rule.methods?.includes(method);
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    const controllers = this.discoveryService.getControllers();
    const permissionsMap = new Map<string, DeepPartial<Permission>>();

    for (const wrapper of controllers) {
      const { instance } = wrapper;
      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);
      const controllerPath = this.normalizePath(
        this.reflector.get<string>(PATH_METADATA, instance.constructor),
      );

      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === 'constructor') continue;

        const handler = prototype[methodName];
        if (typeof handler !== 'function') continue;

        const routePath = this.reflector.get<string>(PATH_METADATA, handler);
        const methodNum = this.reflector.get<RequestMethod>(
          METHOD_METADATA,
          handler,
        );

        if (!routePath || methodNum === undefined) continue;

        const method = this.methodMap[methodNum];
        const fullPath = this.normalizePath(`${controllerPath}/${routePath}`);

        if (!method || !fullPath) continue;
        if (this.notRequired(fullPath, method)) continue;

        const key = `${method}:${fullPath}`;
        permissionsMap.set(key, { path: fullPath, method });
      }
    }

    await Promise.all(
      [...permissionsMap.values()].map((permission) =>
        this.permissionsService.create(permission),
      ),
    );
  }
}
