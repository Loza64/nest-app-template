/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/api/users/users.service';
import { User } from 'src/entities/user.entity';

export interface JwtPayload {
    sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate({ sub }: JwtPayload): Promise<User> {
        const user = await this.usersService.findAuth(sub);

        if (!user) {
            throw new UnauthorizedException('Token inválido: usuario no encontrado');
        }

        return user;
    }
}
