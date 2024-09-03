export abstract class AbstractOrderService {
  abstract create(data: {
    ticketId: string;
    userId: string;
    ticketValue: number;
  }): Promise<{ orderId: string }>;
}
