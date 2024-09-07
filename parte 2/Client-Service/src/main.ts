import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { CustomExceptionFilter } from "./infra/filters/httpException";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.CLIENT_SERVICE_HOST,
        port: Number(process.env.CLIENT_SERVICE_PORT),
      },
    }
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen();
}
bootstrap();
