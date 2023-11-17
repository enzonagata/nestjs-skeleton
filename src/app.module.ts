import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DataBaseConfig, configDataBase } from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { TracingMiddleware } from './common/middleware/tracing.middleware';
import { TestModule } from './modules/test/test.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TestModule,
    // TypeOrmModule.forRootAsync({
    //   useClass: DataBaseConfig,
    //   inject: [DataBaseConfig],
    // }),
    // MongooseModule.forRoot(configDataBase.getConnectionMongo()),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TracingMiddleware).forRoutes('*');
  }
}
