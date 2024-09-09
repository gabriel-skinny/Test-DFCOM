import { Injectable } from "@nestjs/common";
import { Ticket } from "../entities/ticket";
import { AbstractTicketRepository } from "../repositories/ticketRepository";

interface IGetTicketsByBuyerIdUseCaseParams {
  buyerId: string;
  page: number;
  perPage: number;
}

interface IGetTicketsByBuyerIdUseCaseReturn {
  tickets: Ticket[];
  totalTickets: number;
}

@Injectable()
export class GetTicketsByBuyerIdUseCase {
  constructor(private ticketRepository: AbstractTicketRepository) {}

  async execute({
    buyerId,
    page,
    perPage,
  }: IGetTicketsByBuyerIdUseCaseParams): Promise<IGetTicketsByBuyerIdUseCaseReturn> {
    const { tickets, totalCount } =
      await this.ticketRepository.findManyByBuyerId({
        buyerId,
        limit: perPage,
        skip: page * perPage - perPage,
      });

    return { tickets, totalTickets: totalCount };
  }
}
