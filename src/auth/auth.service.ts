import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

interface Payload {
  id: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  generateJwt(user: UserEntity): string {
    const payload: Payload = { id: user.id, email: user.email };
    return sign(payload, this.configService.getOrThrow('JWT_SECRET')!, {
      expiresIn: '1h',
    });
  }

  async verifyPassword(
    hashedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async register(email: string, password: string): Promise<UserEntity> {
    const hash = await bcrypt.hash(password, 10);
    return this.usersService.createUser({ email, password: hash });
  }

  async authenticate(email: string, password: string): Promise<string> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new Error('Пользователь не найден');
    const validPassword = await this.verifyPassword(user.password, password);
    if (!validPassword) throw new Error('Неверный пароль');
    return this.generateJwt(user);
  }
}
