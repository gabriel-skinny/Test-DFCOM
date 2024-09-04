import { Payment } from 'src/application/entities/payment';
import { PaymentModel } from '../entities/payment';

export class PaymentMapper {
  static toDatabase(raw: Payment): PaymentModel {
    return {
      _id: raw.id,
      id: raw.id,
      value: raw.value,
      creditCardExpirationDate: raw.creditCardExpirationDate,
      creditCardNumber: raw.creditCardNumber,
      creditCardSecurityNumber: raw.creditCardSecurityNumber,
      orderId: raw.orderId,
      status: raw.status,
      userId: raw.userId,
      webhookUrl: raw.webhookUrl,
      externalId: raw.externalId,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomain(model: PaymentModel): Payment {
    return new Payment({
      id: model.id,
      value: model.value,
      creditCardExpirationDate: model.creditCardExpirationDate,
      creditCardNumber: model.creditCardNumber,
      creditCardSecurityNumber: model.creditCardSecurityNumber,
      orderId: model.orderId,
      status: model.status,
      userId: model.userId,
      webhookUrl: model.webhookUrl,
      externalId: model.externalId,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
      updatedAt: model.updatedAt,
    });
  }
}
