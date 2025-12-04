import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtGuard } from './guard/jwt.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtGuard],
  exports: [AuthService],
})
export class AuthModule { }
