import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { UsersService } from 'src/api/users/users.service';
import JwtPayload from 'src/common/models/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(username: string, password: string): Promise<SessionResponseDto> {
    const user = await this.usersService.login(username);
    if (!user)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    const token = this.jwtService.sign<JwtPayload>({ sub: user.id });
    return { token, data: user };
  }

  async signUp(dto: SignUpDto): Promise<SessionResponseDto> {
    const user = await this.usersService.create({ ...dto, role: { id: 1 } });
    const token = this.jwtService.sign<JwtPayload>({ sub: user.id });
    return { token, data: user };
  }

  async findForAuth(id: number): Promise<User | null> {
    const user = await this.usersService.findAuth(id);
    return user;
  }
}
