import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new ForbiddenException('Нет токена!');
    try {
      verify(token, this.configService.getOrThrow('JWT_SECRET'));
      return true;
    } catch (err) {
      throw new ForbiddenException('Некорректный токен');
    }
  }
}
