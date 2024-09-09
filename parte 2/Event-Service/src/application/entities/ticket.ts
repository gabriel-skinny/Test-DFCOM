import { randomUUID } from "crypto";

interface IPropsTicket {
  id?: string;
  price: number;
  buyed?: boolean;
  buyerId?: string;
  eventId: string;
  type: string;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Ticket {
  readonly id: string;
  readonly price: number;
  readonly type: string;
  private _buyed: boolean;
  private _buyerId: string;
  readonly eventId: string;
  private _isAvailable: boolean;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;

  constructor(props: IPropsTicket) {
    this.id = props.id || randomUUID();
    this.price = props.price;
    this._buyed = props.buyed || false;
    this._buyerId = props.buyerId;
    this.eventId = props.eventId;
    this._isAvailable = props.isAvailable || true;
    this.type = props.type;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public get isAvailable() {
    return this._isAvailable;
  }

  public get buyed() {
    return this._buyed;
  }

  public get buyerId() {
    return this._buyerId;
  }

  public buy(buyerId: string) {
    if (this._buyed) throw new Error("Ticket already buyed");

    this._buyed = true;
    this._buyerId = buyerId;
  }

  public makeUnavailable() {
    this._isAvailable = false;
  }
}
