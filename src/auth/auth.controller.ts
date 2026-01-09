import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/common/decorators/profile';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<SessionResponseDto> {
        const session = await this.authService.login(dto.username, dto.password);
        return plainToInstance(SessionResponseDto, session);
    }

    @Post('signup')
    async signUp(@Body() dto: SignUpDto): Promise<SessionResponseDto> {
        const session = await this.authService.signUp(dto);
        return plainToInstance(SessionResponseDto, session);
    }

    @Get('profile')
    profile(@Profile() profile: User): User {
        return profile
    }
}
