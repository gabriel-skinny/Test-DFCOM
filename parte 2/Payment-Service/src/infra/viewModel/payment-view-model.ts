import { Payment } from 'src/application/entities/payment';

export interface IPaymentViewModel {
  id: string;
  orderId: string;
  userId: string;
  status: string;
  value: number;
  webhookUrl: string;
  externalId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class PaymentViewModel {
  static toHttp(raw: Payment): IPaymentViewModel {
    return {
      id: raw.id,
      externalId: raw.externalId,
      orderId: raw.orderId,
      status: raw.status,
      userId: raw.userId,
      value: raw.value,
      webhookUrl: raw.webhookUrl,
      updatedAt: raw.updatedAt,
      createdAt: raw.createdAt,
    };
  }
}
