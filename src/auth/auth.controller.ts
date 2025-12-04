import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() body: { email: string; password: string },
  ) {
    try {
      const user = await this.authService.register(body.email, body.password);
      return res
        .status(HttpStatus.CREATED)
        .send({ message: 'Пользователь зарегистрирован!', user });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: err.message });
    }
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() body: { email: string; password: string },
  ) {
    try {
      const token = await this.authService.authenticate(
        body.email,
        body.password,
      );
      return res.send({ access_token: token });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: err.message });
    }
  }
}
