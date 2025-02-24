import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

jest.mock('@nestjs/config');

describe('getDatabaseConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    configService.get = jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'DATABASE_HOST':
          return 'localhost';
        case 'DATABASE_PORT':
          return 5432;
        case 'DATABASE_USER':
          return 'user';
        case 'DATABASE_PASSWORD':
          return 'password';
        case 'DATABASE_NAME':
          return 'test_db';
        default:
          return null;
      }
    });
  });

  it('should return the correct database configuration', async () => {
    const config: TypeOrmModuleOptions = await getDatabaseConfig(configService);

    expect(config).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'test_db',
      autoLoadEntities: true,
      synchronize: false,
      dropSchema: false,
      logging: false,
      logger: 'file',
    });
  });
});
