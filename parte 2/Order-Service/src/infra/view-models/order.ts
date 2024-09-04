import { Order } from 'src/application/entities/order';

export interface IOrderViewModel {
  id: string;
  status: string;
  expireTime: Date;
  value: number;
  ticketId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OrderViewModel {
  static toHttp(raw: Order): IOrderViewModel {
    return {
      id: raw.id,
      status: raw.status.value,
      expireTime: raw.expireTime,
      value: raw.value,
      ticketId: raw.ticketId,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
