import { NotFoundError } from "../errors/notFound";
import { AbstractTicketRepository } from "../repositories/ticketRepository";

interface IMakeTicketAvailableUseCaseParams {
  ticketId: string;
}

export class MakeTicketAvailableUseCase {
  constructor(private ticketRepository: AbstractTicketRepository) {}

  async execute({
    ticketId,
  }: IMakeTicketAvailableUseCaseParams): Promise<void> {
    const { rowsAffected } = await this.ticketRepository.updateById({
      id: ticketId,
      updateData: {
        isAvailable: true,
      },
    });

    if (rowsAffected == 0)
      throw new NotFoundError("Ticket to make available not found");
  }
}
