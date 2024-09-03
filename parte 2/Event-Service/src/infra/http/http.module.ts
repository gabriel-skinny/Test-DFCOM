import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ServiceModule } from '../services/services.module';
import { EventController } from './controllers/event';
import { BullModule } from '@nestjs/bullmq';
import { GetManyEventsUseCase } from '../../application/use-cases/get-many-events';
import { RequestBuyOrderUseCaseCase } from '../../application/use-cases/request-buy-order';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'order-queue' }),
    DatabaseModule,
    ServiceModule,
  ],
  providers: [GetManyEventsUseCase, RequestBuyOrderUseCaseCase],
  controllers: [EventController],
})
export default class HttpModule {}
