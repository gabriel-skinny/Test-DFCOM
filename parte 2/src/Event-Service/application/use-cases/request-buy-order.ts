import { Injectable } from '@nestjs/common';
import { AbstractTicketRepository } from '../repositories/ticketRepository';
import { AbstractOrderService } from '../services/orderService';

interface IRequestBuyOrderUseCaseCaseParams {
  eventId: string;
  userId: string;
}

@Injectable()
export class RequestBuyOrderUseCaseCase {
  constructor(
    private ticketRepository: AbstractTicketRepository,
    private orderService: AbstractOrderService,
  ) {}

  async execute({
    eventId,
    userId,
  }: IRequestBuyOrderUseCaseCaseParams): Promise<void> {
    const ticketAvailable =
      await this.ticketRepository.findTicketAvailableByEventId(eventId);
    if (!ticketAvailable)
      throw new Error('Event does not have available tickets anymore');

    await this.orderService.create({
      ticketId: ticketAvailable.id,
      ticketValue: ticketAvailable.price,
      userId,
    });

    ticketAvailable.makeUnavailable();
    await this.ticketRepository.save(ticketAvailable);
  }
}
