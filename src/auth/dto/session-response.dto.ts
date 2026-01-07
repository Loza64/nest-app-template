import { User } from 'src/entities/user.entity';
import { Expose, Type } from 'class-transformer';

export class SessionResponseDto {
  @Expose()
  token: string;

  @Expose()
  @Type(() => User)
  data: User;
}
