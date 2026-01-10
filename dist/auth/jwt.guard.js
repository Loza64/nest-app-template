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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../api/users/users.service");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    usersService;
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    publicPaths = [
        { path: '/api/auth/login', methods: ['POST'] },
        { path: '/api/auth/signup', methods: ['POST'] },
    ];
    authOnlyPaths = [
        { path: '/api/auth/profile', methods: ['GET', 'PUT'] },
    ];
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const path = request.route.path;
        const method = request.method.toUpperCase();
        if (this.isPathAllowed(this.publicPaths, path, method))
            return true;
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw new common_1.UnauthorizedException('Token missing');
        const token = authHeader.replace('Bearer ', '');
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const user = await this.usersService.findOneBy({
            filters: { id: payload.sub, blocked: false },
            relations: { role: { permissions: true } },
        });
        if (!user)
            throw new common_1.UnauthorizedException('The account associated with this token no longer exists.');
        if (user.deletedAt)
            throw new common_1.UnauthorizedException('This account is currently deactivated.');
        if (user.blocked)
            throw new common_1.UnauthorizedException('This account has been blocked. Please contact support.');
        request.user = user;
        if (this.isPathAllowed(this.authOnlyPaths, path, method))
            return true;
        const allowed = user.role?.permissions?.some((p) => p.path === path && p.method.toUpperCase() === method);
        if (!allowed)
            throw new common_1.ForbiddenException('Permission denied');
        return true;
    }
    isPathAllowed(rules, path, method) {
        return rules.some((rule) => rule.path === path && rule.methods.includes(method));
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], JwtAuthGuard);
//# sourceMappingURL=jwt.guard.js.map