import { OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
export declare class PermissionsSeeder implements OnApplicationBootstrap {
    private readonly discoveryService;
    private readonly reflector;
    private readonly permissionsService;
    private readonly unRequiredPaths;
    private readonly methodMap;
    constructor(discoveryService: DiscoveryService, reflector: Reflector, permissionsService: PermissionsService);
    private normalizePath;
    private notRequired;
    onApplicationBootstrap(): Promise<void>;
}
