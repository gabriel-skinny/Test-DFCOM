export enum OrderStatusEnum {
  PAYED = 'payed',
  ON_PAYMENT = 'on_payment',
  CANCELED = 'canceld',
  EXPIRED = 'expired',
}
export class Status {
  private _status: OrderStatusEnum;

  constructor(status: OrderStatusEnum) {
    this._status = status;
  }

  public get value() {
    return this._status;
  }

  public changeStatus(status: OrderStatusEnum) {
    const unchableStatus = [
      OrderStatusEnum.CANCELED,
      OrderStatusEnum.EXPIRED,
      OrderStatusEnum.PAYED,
    ];
    if (unchableStatus.includes(this._status))
      throw new Error('Can not change status');

    if (status == OrderStatusEnum.PAYED) {
      this._status = status;
    } else {
      throw new Error('Not recognazible status');
    }
  }
}
