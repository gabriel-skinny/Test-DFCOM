import { Controller } from "@nestjs/common";

import { EventPattern, MessagePattern, Transport } from "@nestjs/microservices";
import { GetManyEventsUseCase } from "../../application/use-cases/get-many-events";
import { OrderTicketUseCaseCase } from "../../application/use-cases/order-ticket";
import { BuyTicketUseCase } from "src/application/use-cases/buy-ticket";

interface IOrderTicketParams {
  eventId: string;
  userId: string;
}

interface IGetManyParams {
  perPage: number;
  page: number;
}

interface IPayoutTicketParams {
  value: { ticketId: string; orderId: string; userId: string };
}

@Controller()
export class EventController {
  constructor(
    private readonly getManyEventsUseCase: GetManyEventsUseCase,
    private readonly orderTicketUseCase: OrderTicketUseCaseCase,
    private readonly buyTicketUseCase: BuyTicketUseCase
  ) {}

  @MessagePattern({ cmd: "get-many-events" }, Transport.TCP)
  async getMany({ page, perPage }: IGetManyParams) {
    const events = await this.getManyEventsUseCase.execute({ page, perPage });

    return events;
  }

  @MessagePattern({ cmd: "order-ticket" }, Transport.TCP)
  async orderTicket({ eventId, userId }: IOrderTicketParams) {
    const { ticketId } = await this.orderTicketUseCase.execute({
      eventId,
      userId,
    });

    return { ticketId };
  }

  @EventPattern("order-payed")
  async payTicket(data: IPayoutTicketParams) {
    await this.buyTicketUseCase.execute({
      ticketId: data.value.ticketId,
      userId: data.value.userId,
    });
  }
}
