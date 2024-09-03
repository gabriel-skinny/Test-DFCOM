import { NestFactory } from '@nestjs/core';
import { AppModule } from './Event-Service/app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
