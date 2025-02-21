import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
@Injectable()
export class DataBaseConfig {
  constructor(private configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbPort = this.configService.get<number>('DB_PORT');
    const dbDatabase = this.configService.get<string>('DB_DATABASE');
    const dbUsername = this.configService.get<string>('DB_USERNAME');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');

    if (!dbHost || !dbPort || !dbDatabase || !dbUsername || !dbPassword) {
      throw new BadRequestException(
        'Configuração do banco de dados postgres inválida.',
      );
    }

    return {
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      database: dbDatabase,
      username: dbUsername,
      password: dbPassword,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      synchronize: false,
    };
  }

  public getConnectionMongo(): string {
    const dbMongo = this.configService.get<string>('DB_MONGO');

    if (!dbMongo) {
      throw new BadRequestException('Variável DB_MONGO inválida.');
    }

    return dbMongo;
  }
}

const configService = new ConfigService();
const configDataBase = new DataBaseConfig(configService);

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  synchronize: false,
});

export { configDataBase };
