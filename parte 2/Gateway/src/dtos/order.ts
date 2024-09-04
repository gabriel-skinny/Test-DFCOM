import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDTO {
  @IsNotEmpty()
  @IsString()
  creditCardNumber: string;

  @IsNotEmpty()
  @IsString()
  creditCardSecurityNumber: string;

  @IsNotEmpty()
  @IsString()
  creditCardExpirationDate: string;
}
