import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AbstractTicketRepository } from '../repositories/ticketRepository';
import { NotFoundError } from '../errors/notFound';

interface IOrderTicketUseCaseCaseParams {
  eventId: string;
  userId: string;
}

interface IOrderTicketUseCaseReturn {
  ticketId: string;
}

@Injectable()
export class OrderTicketUseCaseCase {
  constructor(
    private ticketRepository: AbstractTicketRepository,
    @InjectQueue('order-queue')
    private orderQeue: Queue,
  ) {}

  async execute({
    eventId,
    userId,
  }: IOrderTicketUseCaseCaseParams): Promise<IOrderTicketUseCaseReturn> {
    const ticketAvailable =
      await this.ticketRepository.findTicketAvailableByEventId(eventId);
    if (!ticketAvailable)
      throw new NotFoundError('Event does not have available tickets anymore');

    await this.orderQeue.add('create-order', {
      ticketId: ticketAvailable.id,
      ticketValue: ticketAvailable.price,
      userId,
    });

    ticketAvailable.makeUnavailable();
    await this.ticketRepository.save(ticketAvailable);

    return { ticketId: ticketAvailable.id };
  }
}
