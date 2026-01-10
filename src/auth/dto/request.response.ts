import { Request } from 'express';
import { User } from 'src/entities/user.entity';

export interface RequestResponse extends Request {
  user: User;
}
