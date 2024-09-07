import { randomUUID } from "crypto";

export enum PaymentStatusEnum {
  PAYED = "payed",
  PENDENT = "pendent",
  CANCELED = "canceled",
}

interface IPropsPayment {
  id?: string;
  orderId: string;
  userId: string;
  status?: PaymentStatusEnum;
  value: number;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
  creditCardExpirationDate: string;
  webhookUrl?: string;
  externalId?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export class Payment {
  private _id: string;
  readonly orderId: string;
  readonly userId: string;
  readonly value: number;
  private _status: PaymentStatusEnum;
  readonly webhookUrl: string;
  public externalId?: string;
  readonly creditCardNumber: string;
  readonly creditCardSecurityNumber: string;
  readonly creditCardExpirationDate: string;
  private _createdAt: Date;
  readonly deletedAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: IPropsPayment) {
    this._id = props.id || randomUUID();
    this.orderId = props.orderId;
    this._status = props.status || PaymentStatusEnum.PENDENT;
    this.externalId = props.externalId;
    this.userId = props.userId;
    this.creditCardNumber = props.creditCardNumber;
    this.creditCardSecurityNumber = props.creditCardSecurityNumber;
    this.creditCardExpirationDate = props.creditCardExpirationDate;
    this.value = props.value;

    this._createdAt = props.createdAt || new Date();
    this.deletedAt = props.deletedAt;
    this.updatedAt = props.updatedAt;

    this.webhookUrl = props.webhookUrl || "https://webhook.com";
  }

  public get id() {
    return this._id;
  }

  public get createdAt() {
    return this._createdAt;
  }

  public get status() {
    return this._status;
  }

  public pay() {
    this._status = PaymentStatusEnum.PAYED;
  }
}
