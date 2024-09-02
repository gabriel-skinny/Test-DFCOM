import { Order } from '../entities/order';

export abstract class AbstractOderRepository {
  abstract save(order: Order): Promise<void>;
  abstract existsOrderAvilableByTicketId(ticketId: string): Promise<boolean>;
}
