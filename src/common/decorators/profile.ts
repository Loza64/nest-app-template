import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestResponse } from 'src/auth/dto/request.response';
import { User } from 'src/entities/user.entity';

export const Profile = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest<RequestResponse>();
        return request.user;
    },
);