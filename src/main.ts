import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import validationExceptionFactory from './common/filters/factories/validation.exception.factory';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import * as momentTimezone from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Cyber Integration')
    .setDescription(
      'Serviço orquestrador de fluxos e integração com as APIs da Cyber Integration',
    )
    .setVersion('1.0')
    .build();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api', {
    exclude: ['healthcheck'],
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  momentTimezone.tz.setDefault('America/Sao_Paulo');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
