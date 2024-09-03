import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbstractEventRepository } from 'src/Event-Service/application/repositories/eventRepository';
import { AbstractTicketRepository } from 'src/Event-Service/application/repositories/ticketRepository';
import { EventModel, EventSchema } from './entities/event';
import { TicketModel, TicketSchema } from './entities/ticket';
import EventRepository from './repositories/eventRepository';
import TicketRepository from './repositories/ticketRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EventModel.name,
        schema: EventSchema,
      },
      {
        name: TicketModel.name,
        schema: TicketSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: AbstractTicketRepository,
      useClass: TicketRepository,
    },
    {
      provide: AbstractEventRepository,
      useClass: EventRepository,
    },
  ],
  exports: [AbstractEventRepository, AbstractTicketRepository],
})
export class DatabaseModule {}
