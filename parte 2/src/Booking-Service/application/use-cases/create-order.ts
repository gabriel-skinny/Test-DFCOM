import { Order, OrderStatusEnum } from '../entities/order';
import { AbstractOderRepository } from '../repositories/orderRepository';
import AbstractEventService from '../services/Event';

interface ICreateOrderParams {
  status: OrderStatusEnum;
  ticketId: string;
  userId: string;
}

interface ICreateOrderReturn {
  orderId: string;
}

export class CreateOrderUseCase {
  constructor(
    private eventService: AbstractEventService,
    private orderRepository: AbstractOderRepository,
  ) {}

  async execute({
    status,
    ticketId,
    userId,
  }: ICreateOrderParams): Promise<ICreateOrderReturn> {
    const ticketAvailability =
      await this.eventService.checkTicketAvailability(ticketId);
    if (!ticketAvailability.isAvailable)
      throw new Error('Can not buy a non available ticket');

    if (!(await this.orderRepository.existsOrderAvilableByTicketId(ticketId)))
      throw new Error('A Order available already exists for that ticket');

    const order = new Order({ status, ticketId, userId });

    await this.orderRepository.save(order);

    return { orderId: order.id };
  }
}
