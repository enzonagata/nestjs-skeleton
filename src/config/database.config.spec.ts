import { DataBaseConfig } from './database.config';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('DataBaseConfig', () => {
  let configService: ConfigService;
  let databaseConfig: DataBaseConfig;

  beforeEach(() => {
    configService = {
      get: jest.fn((key) => {
        switch (key) {
          case 'DB_HOST':
            return 'dbHost';
          case 'DB_PORT':
            return 5432;
          case 'DB_DATABASE':
            return 'dbName';
          case 'DB_USERNAME':
            return 'dbUser';
          case 'DB_PASSWORD':
            return 'dbPassword';
          case 'DB_MONGO':
            return 'mongoConnectionString';
          default:
            return undefined;
        }
      }),
    } as any;

    databaseConfig = new DataBaseConfig(configService);
  });

  it('should be defined', () => {
    expect(databaseConfig).toBeDefined();
  });

  describe('createTypeOrmOptions', () => {
    it('should return TypeOrmModuleOptions', () => {
      const result = databaseConfig.createTypeOrmOptions();

      expect(result).toEqual({
        type: 'postgres',
        host: 'dbHost',
        port: 5432,
        database: 'dbName',
        username: 'dbUser',
        password: 'dbPassword',
        entities: expect.any(Array),
        migrations: expect.any(Array),
        synchronize: false,
      });
    });

    it('should throw BadRequestException if any database config is missing', () => {
      configService.get = jest.fn(() => undefined);

      expect(() => databaseConfig.createTypeOrmOptions()).toThrowError(
        BadRequestException,
      );
    });
  });

  describe('getConnectionMongo', () => {
    it('should return the DB_MONGO value', () => {
      const result = databaseConfig.getConnectionMongo();

      expect(result).toBe('mongoConnectionString');
    });

    it('should throw BadRequestException if DB_MONGO is missing', () => {
      configService.get = jest.fn(() => undefined);

      expect(() => databaseConfig.getConnectionMongo()).toThrowError(
        BadRequestException,
      );
    });
  });
});
