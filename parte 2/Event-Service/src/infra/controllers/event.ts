import { Controller } from "@nestjs/common";

import { EventPattern, MessagePattern, Transport } from "@nestjs/microservices";
import { GetManyEventsUseCase } from "../../application/use-cases/get-many-events";
import { OrderTicketUseCaseCase } from "../../application/use-cases/order-ticket";
import { BuyTicketUseCase } from "src/application/use-cases/buy-ticket";
import { CancelEventUseCase } from "src/application/use-cases/cancel-event";
import { DeleteEventUseCase } from "src/application/use-cases/delete-event";
import { GetTicketsByBuyerIdUseCase } from "src/application/use-cases/get-tickets-by-buyer-id";
import { MakeTicketAvailableUseCase } from "src/application/use-cases/make-ticket-available";
import { PublicEventUseCase } from "src/application/use-cases/public-event";
import { UpdateTicketsValueUseCase } from "src/application/use-cases/update-tickets-value";
import {
  ICreateEventParams,
  IPaginationParams,
  IOrderTicketParams,
  IPayoutTicketParams,
  IUpdateTicketsValueParams,
} from "./interface";
import { CreateEventUseCase } from "src/application/use-cases/create-event";

@Controller()
export class EventController {
  constructor(
    private readonly getManyEventsUseCase: GetManyEventsUseCase,
    private readonly orderTicketUseCase: OrderTicketUseCaseCase,
    private readonly buyTicketUseCase: BuyTicketUseCase,
    private readonly cancelEventUseCase: CancelEventUseCase,
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
    private readonly getTicketsByBuyerIdUseCase: GetTicketsByBuyerIdUseCase,
    private readonly makeTicketAvailableUseCase: MakeTicketAvailableUseCase,
    private readonly publicEventUseCase: PublicEventUseCase,
    private readonly updateTicketsValueUseCase: UpdateTicketsValueUseCase
  ) {}

  @MessagePattern({ cmd: "get-many-events" }, Transport.TCP)
  async getMany({ page, perPage }: IPaginationParams) {
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

  @MessagePattern({ cmd: "cancel-event" }, Transport.TCP)
  async cancelEvent({ eventId }: { eventId: string }) {
    await this.cancelEventUseCase.execute({ eventId });

    return { message: "Event canceled sucessfully" };
  }

  @MessagePattern({ cmd: "create-event" }, Transport.TCP)
  async createEvent({
    creatorId,
    endSellingDate,
    name,
    ticketGroups,
  }: ICreateEventParams): Promise<{ eventId: string }> {
    const { eventId } = await this.createEventUseCase.execute({
      creatorId,
      endSellingDate,
      name,
      ticketGroups,
    });

    return { eventId };
  }

  @MessagePattern({ cmd: "delete-event" }, Transport.TCP)
  async deleteEvent({ eventId }: { eventId: string }) {
    await this.deleteEventUseCase.execute({ eventId });

    return { message: "Event canceled sucessfully" };
  }

  @MessagePattern({ cmd: "get-tickets-by-buyer-id" }, Transport.TCP)
  async getTicketsByBuyerId({
    buyerId,
    page,
    perPage,
  }: { buyerId: string } & IPaginationParams) {
    const { tickets, totalTickets } =
      await this.getTicketsByBuyerIdUseCase.execute({ buyerId, page, perPage });

    return { tickets, totalTickets };
  }

  @MessagePattern({ cmd: "public-event" }, Transport.TCP)
  async publicEvent({ eventId }: { eventId: string }) {
    await this.publicEventUseCase.execute({ eventId });

    return { message: "Event published sucessfully" };
  }

  @MessagePattern({ cmd: "update-tickets-value" }, Transport.TCP)
  async updateTicketsValue({
    eventId,
    newPrice,
    type,
  }: IUpdateTicketsValueParams) {
    await this.updateTicketsValueUseCase.execute({ eventId, newPrice, type });

    return { message: "Tickets updated" };
  }

  @EventPattern("order-canceled")
  async makeTicketAvailable({ ticketId }: { ticketId: string }) {
    await this.makeTicketAvailableUseCase.execute({ ticketId });

    return { message: "Ticket available" };
  }

  @EventPattern("order-payed")
  async payTicket(data: IPayoutTicketParams) {
    await this.buyTicketUseCase.execute({
      ticketId: data.value.ticketId,
      userId: data.value.userId,
    });
  }
}
