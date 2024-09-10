import { Ticket } from "../entities/ticket";
import { IPagination } from "./interface";

export abstract class AbstractTicketRepository {
  abstract save(ticket: Ticket): Promise<void>;
  abstract saveMany(tickets: Ticket[]): Promise<void>;
  abstract updateById(data: {
    id: string;
    updateData: Partial<Ticket>;
  }): Promise<{ rowsAffected: number }>;
  abstract findById(id: string): Promise<Ticket | null>;
  abstract findTicketAvailableByEventId(
    eventId: string
  ): Promise<Ticket | null>;
  abstract findManyByBuyerId(
    data: { buyerId: string } & IPagination
  ): Promise<{ tickets: Ticket[]; totalCount: number }>;
  abstract ticketExistsByEventIdAndType(data: {
    type: string;
    eventId: string;
  }): Promise<{ id: string } | null>;
  abstract updateManyByEventIdAndType(data: {
    eventId: string;
    type: string;
    updateData: Partial<Ticket>;
  }): Promise<{ rowsAffected: number }>;
}
