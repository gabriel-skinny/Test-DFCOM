import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AbstractPaymentRepository } from 'src/application/repositories/paymentRepository';
import { PaymentModel, PaymentSchema } from './entities/payment';
import PaymentRepository from './repositories/paymentRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentModel.name,
        schema: PaymentSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: AbstractPaymentRepository,
      useClass: PaymentRepository,
    },
  ],
  exports: [AbstractPaymentRepository],
})
export class DatabaseModule {}
