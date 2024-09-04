import { Order } from '../entities/order';
import { OrderStatusEnum } from '../entities/status';

export abstract class AbstractOderRepository {
  abstract save(order: Order): Promise<void>;
  abstract existsOrderAvilableByTicketId(ticketId: string): Promise<boolean>;
  abstract findById(id: string): Promise<Order>;
  abstract findManyByUserId(data: {
    userId: string;
    limit: number;
    skip: number;
  }): Promise<Order[]>;
  abstract findByStatusAndIdAndUserId(data: {
    id: string;
    userId: string;
    status: OrderStatusEnum;
  }): Promise<Order | null>;
}
