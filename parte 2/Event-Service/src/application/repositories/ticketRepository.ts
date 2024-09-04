import { Ticket } from '../entities/ticket';

export abstract class AbstractTicketRepository {
  abstract save(ticket: Ticket): Promise<void>;
  abstract updateById(data: {
    id: string;
    updateData: Partial<Ticket>;
  }): Promise<void>;
  abstract findById(id: string): Promise<Ticket | null>;
  abstract findTicketAvailableByEventId(
    eventId: string,
  ): Promise<Ticket | null>;
}
