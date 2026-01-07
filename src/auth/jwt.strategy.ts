/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
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

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.usersService.findOneBy({
            filters: { id: payload.sub, blocked: false },
            relations: { role: { permissions: true } },
        });

        if (!user) {
            throw new Error('Token inválido: usuario no encontrado');
        }

        return user;
    }
}
