import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubHelper } from './common/helpers/pubsub.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './common/config/database.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PubSubHelper],
  exports: [PubSubHelper],
})
export class AppModule {}
