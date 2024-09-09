import { Injectable } from "@nestjs/common";
import { AbstractTicketRepository } from "../repositories/ticketRepository";
import { NotFoundError } from "../errors/notFound";

interface IUpdateTicketsValueUseCaseParams {
  eventId: string;
  type: string;
  newPrice: number;
}

@Injectable()
export class UpdateTicketsValueUseCase {
  constructor(private readonly ticketRepository: AbstractTicketRepository) {}

  async execute({
    eventId,
    newPrice,
    type,
  }: IUpdateTicketsValueUseCaseParams): Promise<void> {
    const { rowsAffected } =
      await this.ticketRepository.updateManyByEventIdAndType({
        eventId,
        type,
        updateData: { price: newPrice },
      });

    if (rowsAffected == 0)
      throw new NotFoundError("Ticket type does not exists for that event");
  }
}
