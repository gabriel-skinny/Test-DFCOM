import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ServiceModule } from './services/services.module';

import { BullModule } from '@nestjs/bullmq';
import { OrderController } from './controllers/order';
import ConfirmPaymentUseCase from 'src/application/use-cases/confirm-payment';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order';
import UpdateOrderStatusUseCase from 'src/application/use-cases/update-order-status';
import { OrderConsumer } from './consumers/order-consumer';
import 'dotenv/config';

@Module({
  imports: [
    BullModule.registerQueue({ name: process.env.BULLMQ_QUEUE_NAME }),
    DatabaseModule,
    ServiceModule,
  ],
  providers: [
    ConfirmPaymentUseCase,
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    OrderConsumer,
  ],
  controllers: [OrderController],
})
export default class InfraModule {}
