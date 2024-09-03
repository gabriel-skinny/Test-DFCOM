import { Module } from '@nestjs/common';
import { GetManyEventsUseCase } from 'Event-Service/application/use-cases/get-many-events';
import { RequestBuyOrderUseCaseCase } from 'Event-Service/application/use-cases/request-buy-order';
import { DatabaseModule } from '../database/database.module';
import { ServiceModule } from '../services/services.module';
import { EventController } from './controllers/event';
import { BullModule } from '@nestjs/bullmq';

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
