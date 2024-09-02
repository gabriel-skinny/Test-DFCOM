import { AbstractTicketRepository } from '../repositories/ticketRepository';
import { AbstractOrderService } from '../services/orderService';

interface IRequestBuyOrderUseCaseCaseParams {
  ticketId: string;
  userId: string;
}

export class RequestBuyOrderUseCaseCase {
  constructor(
    private ticketRepository: AbstractTicketRepository,
    private orderService: AbstractOrderService,
  ) {}

  async execute({
    ticketId,
    userId,
  }: IRequestBuyOrderUseCaseCaseParams): Promise<void> {
    const ticketAvailable =
      await this.ticketRepository.findTicketAvailableById(ticketId);
    if (!ticketAvailable) throw new Error('Can not buy a non available ticket');

    ticketAvailable.makeUnavailable();
    await this.ticketRepository.save(ticketAvailable);

    await this.orderService.create({
      ticketId,
      ticketValue: ticketAvailable.price,
      userId,
    });
  }
}
