import { Payment } from '../entities/payment';

export abstract class AbstractPaymentRepository {
  abstract save(payment: Payment): Promise<void>;
  abstract findPendentByExternalId(externalId: string): Promise<Payment | null>;
}
