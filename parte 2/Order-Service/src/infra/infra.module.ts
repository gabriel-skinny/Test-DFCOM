import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ServiceModule } from './services/services.module';

import { BullModule } from '@nestjs/bullmq';
import { OrderController } from './controllers/order';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order';
import UpdateOrderStatusUseCase from 'src/application/use-cases/update-order-status';
import { OrderConsumer } from './consumers/order-consumer';
import 'dotenv/config';
import MakePaymentUseCase from 'src/application/use-cases/make-payment';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetOrdersByUserIdUseCase } from 'src/application/use-cases/get-orders-by-user-id';

@Module({
  imports: [
    BullModule.registerQueue({ name: process.env.BULLMQ_QUEUE_NAME }),
    DatabaseModule,
    ServiceModule,
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PAYMENT_SERVICE_HOST,
          port: Number(process.env.PAYMENT_SERVICE_PORT),
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
