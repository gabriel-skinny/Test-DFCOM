import { Ticket } from '../entities/ticket';

export abstract class AbstractTicketRepository {
  abstract save(ticket: Ticket): Promise<void>;
  abstract findById(id: string): Promise<Ticket | null>;
  abstract findTicketAvailableById(id: string): Promise<Ticket | null>;
}
