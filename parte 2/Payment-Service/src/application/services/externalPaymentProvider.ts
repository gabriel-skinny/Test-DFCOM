import { randomUUID } from 'crypto';

export abstract class AbstractExternalPaymentProvider {
  abstract makePayment(data: {
    webhookUrl: string;
    creditCardNumber: string;
    creditCardSecurityNumber: string;
    creditCardExpirationDate: string;
  }): Promise<{ id: string }>;
}

export class ExternalPaymentProviderFake
  implements AbstractExternalPaymentProvider
{
  async makePayment(data: {
    webhookUrl: string;
    creditCardNumber: string;
    creditCardSecurityNumber: string;
    creditCardExpirationDate: string;
  }): Promise<{ id: string }> {
    return { id: randomUUID() };
  }
}
