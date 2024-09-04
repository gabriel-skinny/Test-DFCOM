import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderModel } from '../entities/order';
import { AbstractOderRepository } from 'src/application/repositories/orderRepository';
import { Order } from 'src/application/entities/order';
import { OrderStatusEnum } from 'src/application/entities/status';
import { OrderMapper } from '../mappers/order';

@Injectable()
export default class OrderRepository implements AbstractOderRepository {
  constructor(
    @InjectModel(OrderModel.name) private orderModel: Model<OrderModel>,
  ) {}

  async save(order: Order): Promise<void> {
    const orderToCreate = OrderMapper.toDatabase(order);

    await this.orderModel.create(orderToCreate);
  }

  async existsOrderAvilableByTicketId(ticketId: string): Promise<boolean> {
    return !!this.orderModel.exists({ ticketId });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id);

    if (!order) return null;

    return OrderMapper.toDomain(order);
  }

  async findByStatusAndIdAndUserId({
    id,
    userId,
    status,
  }: {
    id: string;
    userId: string;
    status: OrderStatusEnum;
  }): Promise<Order | null> {
    const order = await this.orderModel.findOne({ id, userId, status });

    if (!order) return null;

    return OrderMapper.toDomain(order);
  }
}
