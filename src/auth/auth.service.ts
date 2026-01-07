import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SessionResponseDto } from './dto/session-response.dto';



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async login(username: string, password: string): Promise<SessionResponseDto> {
        const user = await this.usersService.findOneBy({ filters: { username }, relations: { role: { permissions: true } } });
        if (!user) throw new UnauthorizedException('Usuario o contraseña incorrectos');
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new UnauthorizedException('Usuario o contraseña incorrectos');
        const token = this.jwtService.sign({ sub: user.id });
        return { token, data: user };
    }

    async signUp(dto: SignUpDto): Promise<SessionResponseDto> {
        const user = await this.usersService.create({ ...dto, role: { id: 1 } });
        const token = this.jwtService.sign({ sub: user.id });
        return { token, data: user };
    }

    async findForAuth(userId: number): Promise<User> {
        const user = await this.usersService.findOneBy({
            filters: { id: userId, blocked: false },
            relations: { role: { permissions: true } },
        });
        if (!user) throw new UnauthorizedException('Token inválido');
        return user;
    }
}
