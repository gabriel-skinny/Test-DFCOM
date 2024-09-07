import { Payment } from "../entities/payment";

export abstract class AbstractPaymentRepository {
  abstract save(payment: Payment): Promise<void>;
  abstract updateById(data: {
    id: string;
    data: Partial<Payment>;
  }): Promise<void>;
  abstract findPendentByExternalId(externalId: string): Promise<Payment | null>;
  abstract findManyByUserId(data: {
    userId: string;
    skip: number;
    limit: number;
  }): Promise<Payment[]>;
}
