import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { OrderStatusEnum, Status } from './status';

interface IOderProps {
  id?: string;
  status?: OrderStatusEnum;
  expireTime?: Date;
  value: number;
  ticketId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const ORDER_EXPIRES_IN_MINUTES = 10;

export class Order {
  private _id: string;
  private _status: Status;
  readonly ticketId: string;
  readonly value: number;
  readonly expireTime: Date;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;

  constructor(props: IOderProps) {
    this._id = props.id || randomUUID();
    this._status = new Status(props.status || OrderStatusEnum.ON_PAYMENT);
    this.expireTime =
      props.expireTime || addMinutes(new Date(), ORDER_EXPIRES_IN_MINUTES);
    this.ticketId = props.ticketId;
    this.userId = props.userId;
    this.value = props.value;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public get id() {
    return this._id;
  }

  public get status() {
    return this._status;
  }
}
