import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/api/users/users.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    private readonly publicPaths;
    private readonly authOnlyPaths;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private isPathAllowed;
}
