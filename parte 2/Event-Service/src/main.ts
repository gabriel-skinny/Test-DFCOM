import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { CustomExceptionFilter } from "./infra/filters/httpException";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.EVENT_SERVICE_HOST,
      port: Number(process.env.EVENT_SERVICE_PORT),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
      },
      consumer: {
        groupId: "consumer",
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.startAllMicroservices();
}
bootstrap();
