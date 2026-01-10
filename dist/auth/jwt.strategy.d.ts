import { UsersService } from 'src/api/users/users.service';
import JwtPayload from 'src/common/models/jwt.payload';
import { User } from 'src/entities/user.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate({ sub }: JwtPayload): Promise<User>;
}
export {};
