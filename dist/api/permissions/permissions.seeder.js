"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsSeeder = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("@nestjs/common/constants");
const permissions_service_1 = require("./permissions.service");
let PermissionsSeeder = class PermissionsSeeder {
    discoveryService;
    reflector;
    permissionsService;
    unRequiredPaths = [
        { path: '/api/auth/login', methods: ['POST'] },
        { path: '/api/auth/signup', methods: ['POST'] },
        { path: '/api/auth/profile', methods: ['GET', 'PUT'] },
    ];
    methodMap = {
        [common_1.RequestMethod.GET]: 'GET',
        [common_1.RequestMethod.POST]: 'POST',
        [common_1.RequestMethod.PUT]: 'PUT',
        [common_1.RequestMethod.DELETE]: 'DELETE',
        [common_1.RequestMethod.PATCH]: 'PATCH',
        [common_1.RequestMethod.OPTIONS]: 'OPTIONS',
        [common_1.RequestMethod.HEAD]: 'HEAD',
        [common_1.RequestMethod.ALL]: 'ALL',
    };
    constructor(discoveryService, reflector, permissionsService) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.permissionsService = permissionsService;
    }
    normalizePath(path = '') {
        return `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
    }
    notRequired(path, method) {
        return this.unRequiredPaths.some((rule) => {
            const rulePath = rule.path;
            return path === rulePath && rule.methods?.includes(method);
        });
    }
    async onApplicationBootstrap() {
        const controllers = this.discoveryService.getControllers();
        const permissionsMap = new Map();
        for (const wrapper of controllers) {
            const { instance } = wrapper;
            if (!instance)
                continue;
            const prototype = Object.getPrototypeOf(instance);
            const controllerPath = this.normalizePath(this.reflector.get(constants_1.PATH_METADATA, instance.constructor));
            for (const methodName of Object.getOwnPropertyNames(prototype)) {
                if (methodName === 'constructor')
                    continue;
                const handler = prototype[methodName];
                if (typeof handler !== 'function')
                    continue;
                const routePath = this.reflector.get(constants_1.PATH_METADATA, handler);
                const methodNum = this.reflector.get(constants_1.METHOD_METADATA, handler);
                if (!routePath || methodNum === undefined)
                    continue;
                const method = this.methodMap[methodNum];
                const fullPath = this.normalizePath(`${controllerPath}/${routePath}`);
                if (!method || !fullPath)
                    continue;
                if (this.notRequired(fullPath, method))
                    continue;
                const key = `${method}:${fullPath}`;
                permissionsMap.set(key, { path: fullPath, method });
            }
        }
        await Promise.all([...permissionsMap.values()].map((permission) => this.permissionsService.create(permission)));
    }
};
exports.PermissionsSeeder = PermissionsSeeder;
exports.PermissionsSeeder = PermissionsSeeder = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        permissions_service_1.PermissionsService])
], PermissionsSeeder);
//# sourceMappingURL=permissions.seeder.js.map