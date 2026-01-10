import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<SessionResponseDto>;
    signUp(dto: SignUpDto): Promise<SessionResponseDto>;
    profile(profile: User): User;
}
