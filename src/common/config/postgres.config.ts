import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: configService.getOrThrow<'postgres'>('DATABASE_TYPE'),
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  synchronize: true,
  autoLoadEntities: true,
});
