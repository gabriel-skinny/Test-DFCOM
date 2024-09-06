import { Module } from "@nestjs/common";
import { GetManyEventsUseCase } from "src/application/use-cases/get-many-events";
import { OrderTicketUseCaseCase } from "src/application/use-cases/order-ticket";
import { EventController } from "./controllers/event";
import { DatabaseModule } from "./database/database.module";
import { ServiceModule } from "./services/services.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "event-service",
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: "consumer",
          },
        },
      },
    ]),
    DatabaseModule,
    ServiceModule,
  ],
  providers: [GetManyEventsUseCase, OrderTicketUseCaseCase],
  controllers: [EventController],
})
export class InfraModule {}
