import { Injectable } from '@nestjs/common';
import { AbstractTicketRepository } from '../repositories/ticketRepository';
import { AbstractOrderService } from '../services/orderService';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

interface IRequestBuyOrderUseCaseCaseParams {
  eventId: string;
  userId: string;
}

@Injectable()
export class RequestBuyOrderUseCaseCase {
  constructor(
    private ticketRepository: AbstractTicketRepository,
    @InjectQueue('order-queue')
    private orderQeue: Queue,
  ) {}

  async execute({
    eventId,
    userId,
  }: IRequestBuyOrderUseCaseCaseParams): Promise<void> {
    const ticketAvailable =
      await this.ticketRepository.findTicketAvailableByEventId(eventId);
    if (!ticketAvailable)
      throw new Error('Event does not have available tickets anymore');

    await this.orderQeue.add('create-order', {
      ticketId: ticketAvailable.id,
      ticketValue: ticketAvailable.price,
      userId,
    });

    ticketAvailable.makeUnavailable();
    await this.ticketRepository.save(ticketAvailable);
  }
}
