import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventModel, EventSchema } from './entities/event';
import { TicketModel, TicketSchema } from './entities/ticket';
import EventRepository from './repositories/eventRepository';
import TicketRepository from './repositories/ticketRepository';
import { AbstractTicketRepository } from '../../application/repositories/ticketRepository';
import { AbstractEventRepository } from '../../application/repositories/eventRepository';

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
