import { randomUUID } from 'crypto';

interface IPropsEvent {
  id?: string;
  name: string;
  ticketNumber: number;
  publishedDate: Date;
  endSellingDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Event {
  private _id: string;
  readonly name: string;
  readonly ticketNumber: number;
  readonly publishedDate: Date;
  readonly endSellingDate: Date;
  private _createdAt: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;

  constructor(props: IPropsEvent) {
    this._id = props.id || randomUUID();
    this.name = props.name;
    this.ticketNumber = props.ticketNumber;
    this.publishedDate = props.publishedDate;
    this.endSellingDate = props.endSellingDate;

    this._createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public get id() {
    return this._id;
  }

  public get createdAt() {
    return this._createdAt;
  }
}
