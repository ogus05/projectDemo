import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';
import { AccessTokenExceptionFilter } from './auth/exceptions/token.f';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    dismissDefaultMessages: true,
  }));
  app.setViewEngine('hbs');
  app.setBaseViewsDir(path.join(__dirname, '..', '..', 'client', 'public', 'view'));
  app.use(cookieParser());
  app.useGlobalFilters(new AccessTokenExceptionFilter());
  await app.listen(3000);
}
bootstrap();
