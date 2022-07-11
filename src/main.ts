import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './libs/filters';
import { ResponseInterceptor } from './libs/interceptors';
import { winstonLogger } from './libs/options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
    cors: {
      origin: ['https://hanseithon.com', 'http://172.16.255.100'],
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use('/public', express.static(join(__dirname, '../public')));

  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
