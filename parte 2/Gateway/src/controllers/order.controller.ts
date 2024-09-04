/* @UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly confirmPaymentUseCase: ConfirmPaymentUseCase,
  ) {}

  @Post('confirm-payment/:orderId')
  async confirmPayment(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() paymentData: ConfirmPaymentDTO,
    @Req() { user }: { user: ILoginTokenData },
  ) {
    await this.confirmPaymentUseCase.execute({
      orderId,
      userId: user.userId,
      creditCardExpirationDate: paymentData.creditCardExpirationDate,
      creditCardNumber: paymentData.creditCardNumber,
      creditCardSecurityNumber: paymentData.creditCardSecurityNumber,
    });

    return {
      message: 'Payment sent',
      statusCode: HttpStatus.OK,
    };
  }
} */
