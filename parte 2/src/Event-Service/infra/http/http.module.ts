import { Module } from '@nestjs/common';
import { EventController } from './controllers/event';
import { GetManyEventsUseCase } from 'src/Event-Service/application/use-cases/get-many-events';
import { RequestBuyOrderUseCaseCase } from 'src/Event-Service/application/use-cases/request-buy-order';
import { DatabaseModule } from '../database/database.module';
import { ServiceModule } from '../services/services.module';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [GetManyEventsUseCase, RequestBuyOrderUseCaseCase],
  controllers: [EventController],
})
export default class HttpModule {}
