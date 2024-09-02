import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';

export enum OrderStatusEnum {
  PAYED = 'payed',
  ON_PAYMENT = 'on_payment',
  CANCELED = 'canceld',
  EXPIRED = 'expired',
}

interface IOderProps {
  id?: string;
  status: OrderStatusEnum;
  expireTime?: Date;
  ticketId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const ORDER_EXPIRES_IN_MINUTES = 10;

export class Order {
  private _id: string;
  private _status: OrderStatusEnum;
  readonly ticketId: string;
  readonly expireTime: Date;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;

  constructor(props: IOderProps) {
    this._id = props.id || randomUUID();
    this._status = props.status;
    this.expireTime =
      props.expireTime || addMinutes(new Date(), ORDER_EXPIRES_IN_MINUTES);
    this.ticketId = props.ticketId;
    this.userId = props.userId;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
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

  public get id() {
    return this._id;
  }

  public get status() {
    return this._status;
  }
}
