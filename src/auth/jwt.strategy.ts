import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/api/users/users.service';
import JwtPayload from 'src/common/models/jwt.payload';
import { User } from 'src/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super();
    }

    async validate({ sub }: JwtPayload): Promise<User> {
        const user = await this.usersService.findAuth(sub);

        if (!user) {
            throw new UnauthorizedException(
                'The account associated with this token no longer exists.',
            );
        }

        if (user.deletedAt) {
            throw new UnauthorizedException(
                'This account is currently deactivated.',
            );
        }

        if (user.blocked) {
            throw new UnauthorizedException(
                'This account has been blocked. Please contact support.',
            );
        }

        return user;
    }
}
