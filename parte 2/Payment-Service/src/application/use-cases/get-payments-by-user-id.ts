import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment';
import { AbstractPaymentRepository } from '../repositories/paymentRepository';

interface IGetPaymentsByUserIdParams {
  userId: string;
  perPage: number;
  page: number;
}

@Injectable()
export class GetPaymentsByUserIdUseCase {
  constructor(private paymentRepository: AbstractPaymentRepository) {}

  async execute({
    userId,
    page,
    perPage,
  }: IGetPaymentsByUserIdParams): Promise<Payment[]> {
    return this.paymentRepository.findManyByUserId({
      userId,
      limit: perPage,
      skip: page * perPage - perPage,
    });
  }
}
