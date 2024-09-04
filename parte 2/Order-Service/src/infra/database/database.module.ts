import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AbstractOderRepository } from 'src/application/repositories/orderRepository';
import { OrderModel, OrderSchema } from './entities/order';
import OrderRepository from './repositories/orderRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderModel.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: AbstractOderRepository,
      useClass: OrderRepository,
    },
  ],
  exports: [AbstractOderRepository],
})
export class DatabaseModule {}
