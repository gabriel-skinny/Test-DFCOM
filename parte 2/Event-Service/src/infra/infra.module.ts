import { Module } from '@nestjs/common';
import { GetManyEventsUseCase } from 'src/application/use-cases/get-many-events';
import { OrderTicketUseCaseCase } from 'src/application/use-cases/order-ticket';
import { EventController } from './controllers/event';
import { DatabaseModule } from './database/database.module';
import { ServiceModule } from './services/services.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'order-queue' }),
    DatabaseModule,
    ServiceModule,
  ],
  providers: [GetManyEventsUseCase, OrderTicketUseCaseCase],
  controllers: [EventController],
})
export class InfraModule {}
