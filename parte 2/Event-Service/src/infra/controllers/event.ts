import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { GetManyEventsUseCase } from '../../application/use-cases/get-many-events';
import { OrderTicketUseCaseCase } from '../../application/use-cases/order-ticket';

interface IOrderTicketParams {
  eventId: string;
  userId: string;
}

interface IGetManyParams {
  perPage: number;
  page: number;
}

@Controller()
export class EventController {
  constructor(
    private readonly getManyEventsUseCase: GetManyEventsUseCase,
    private readonly orderTicketUseCase: OrderTicketUseCaseCase,
  ) {}

  @MessagePattern({ cmd: 'get-many-events' })
  async getMany({ page, perPage }: IGetManyParams) {
    const events = await this.getManyEventsUseCase.execute({ page, perPage });

    return events;
  }

  @MessagePattern({ cmd: 'order-ticket' })
  async orderTicket({ eventId, userId }: IOrderTicketParams) {
    const { ticketId } = await this.orderTicketUseCase.execute({
      eventId,
      userId,
    });

    return { ticketId };
  }
}
