import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RequestResponse } from './dto/request.response';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    private readonly publicPaths = ['/api/auth/login', '/api/auth/signup'];
    private readonly authOnlyPaths = ['/api/auth/profile'];

    // Normaliza la ruta: agrega '/' inicial, reemplaza params y quita '/' final
    private normalizePath(path: string): string {
        if (!path) return '';
        let normalized = path.replace(/:([^/]+)/g, ':param');
        if (!normalized.startsWith('/')) normalized = '/' + normalized;
        if (!normalized.endsWith(':param') && normalized.endsWith('/')) normalized = normalized.slice(0, -1);
        return normalized;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestResponse>();
        const path = this.normalizePath(request.route?.path);
        const method = request.method.toUpperCase();

        const normalizedPublicPaths = this.publicPaths.map(p => this.normalizePath(p));
        const normalizedAuthOnlyPaths = this.authOnlyPaths.map(p => this.normalizePath(p));

        if (normalizedPublicPaths.includes(path)) return true;

        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Token missing');
        const token = authHeader.replace('Bearer ', '');
        let payload: { sub: number };
        try {
            payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        const user = await this.usersService.findOneBy({
            filters: { id: payload.sub, blocked: false },
            relations: { role: { permissions: true } },
        });

        if (!user) throw new UnauthorizedException('User not found');
        if (user.blocked) throw new UnauthorizedException('User blocked');

        request.user = user;

        if (normalizedAuthOnlyPaths.includes(path)) return true;

        const allowed = user.role?.permissions?.some(
            p => this.normalizePath(p.path) === path && p.method.toUpperCase() === method
        );

        if (!allowed) throw new ForbiddenException('Permission denied');

        return true;
    }
}
