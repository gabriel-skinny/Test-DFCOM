import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentStatusEnum } from 'src/application/entities/payment';

export type PaymentDocument = HydratedDocument<PaymentModel>;

@Schema({ collection: 'Payment' })
export class PaymentModel {
  constructor(paymentModel: PaymentModel) {
    Object.keys(paymentModel).map((key) => (this[key] = paymentModel[key]));

    this._id = paymentModel.id;
  }

  @Prop()
  _id?: string;

  @Prop({ _id: true })
  id: string;

  @Prop()
  orderId: string;

  @Prop()
  userId: string;

  @Prop()
  value: number;

  @Prop()
  status: PaymentStatusEnum;

  @Prop()
  webhookUrl: string;

  @Prop()
  externalId?: string;

  @Prop()
  creditCardNumber: string;

  @Prop()
  creditCardSecurityNumber: string;

  @Prop()
  creditCardExpirationDate: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentModel);
