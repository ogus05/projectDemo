import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(path.join(__dirname, '..', '..', 'client', 'public', 'view'));
}
bootstrap();
