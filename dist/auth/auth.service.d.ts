import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { UsersService } from 'src/api/users/users.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    login(username: string, password: string): Promise<SessionResponseDto>;
    signUp(dto: SignUpDto): Promise<SessionResponseDto>;
    findForAuth(id: number): Promise<User | null>;
}
