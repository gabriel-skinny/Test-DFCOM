import { Order } from 'src/application/entities/order';
import { OrderModel } from '../entities/order';

export class OrderMapper {
  static toDatabase(raw: Order): OrderModel {
    return {
      _id: raw.id,
      id: raw.id,
      value: raw.value,
      status: raw.status.value,
      expireTime: raw.expireTime,
      ticketId: raw.ticketId,
      userId: raw.userId,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomain(model: OrderModel): Order {
    return new Order({
      id: model.id,
      value: model.value,
      status: model.status,
      expireTime: model.expireTime,
      ticketId: model.ticketId,
      userId: model.userId,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
      updatedAt: model.updatedAt,
    });
  }
}
