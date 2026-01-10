import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestResponse } from './dto/request.response';
import { UsersService } from 'src/api/users/users.service';
import PathRule from 'src/common/models/path.rule';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private readonly publicPaths: PathRule[] = [
    { path: '/api/auth/login', methods: ['POST'] },
    { path: '/api/auth/signup', methods: ['POST'] },
  ];

  private readonly authOnlyPaths: PathRule[] = [
    { path: '/api/auth/profile', methods: ['GET', 'PUT'] },
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestResponse>();
    const path = request.route.path;
    const method = request.method.toUpperCase();

    if (this.isPathAllowed(this.publicPaths, path, method)) return true;

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('Token missing');

    const token = authHeader.replace('Bearer ', '');
    let payload: { sub: number };

    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.findOneBy({
      filters: { id: payload.sub, blocked: false },
      relations: { role: { permissions: true } },
    });

    if (!user)
      throw new UnauthorizedException(
        'The account associated with this token no longer exists.',
      );
    if (user.deletedAt)
      throw new UnauthorizedException('This account is currently deactivated.');
    if (user.blocked)
      throw new UnauthorizedException(
        'This account has been blocked. Please contact support.',
      );

    request.user = user;

    if (this.isPathAllowed(this.authOnlyPaths, path, method)) return true;

    const allowed = user.role?.permissions?.some(
      (p) => p.path === path && p.method.toUpperCase() === method,
    );

    if (!allowed) throw new ForbiddenException('Permission denied');

    return true;
  }

  private isPathAllowed(
    rules: PathRule[],
    path: string,
    method: string,
  ): boolean {
    return rules.some(
      (rule) => rule.path === path && rule.methods.includes(method),
    );
  }
}
