import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";

import { BullModule } from "@nestjs/bullmq";
import { OrderController } from "./controllers/order";
import { CreateOrderUseCase } from "src/application/use-cases/create-order";
import UpdateOrderStatusUseCase from "src/application/use-cases/update-order-status";
import { OrderConsumer } from "./consumers/order-consumer";
import "dotenv/config";
import MakePaymentUseCase from "src/application/use-cases/make-payment";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { GetOrdersByUserIdUseCase } from "src/application/use-cases/get-orders-by-user-id";

@Module({
  imports: [
    BullModule.registerQueue({ name: process.env.BULLMQ_QUEUE_NAME }),
    DatabaseModule,
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "order-service-producer",
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: "consumer",
          },
        },
      },
    ]),
  ],
  providers: [
    MakePaymentUseCase,
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    OrderConsumer,
    GetOrdersByUserIdUseCase,
  ],
  controllers: [OrderController],
})
export default class InfraModule {}
