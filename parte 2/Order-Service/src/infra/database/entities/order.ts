import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatusEnum } from 'src/application/entities/status';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<OrderModel>;

@Schema({ collection: 'order' })
export class OrderModel {
  constructor(orderModel: OrderModel) {
    Object.keys(orderModel).map((key) => (this[key] = orderModel[key]));

    this._id = orderModel.id;
  }

  @Prop()
  _id?: string;

  @Prop({ _id: true })
  id: string;

  @Prop()
  status: OrderStatusEnum;

  @Prop()
  expireTime: Date;

  @Prop()
  value: number;

  @Prop()
  ticketId: string;

  @Prop()
  userId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);
