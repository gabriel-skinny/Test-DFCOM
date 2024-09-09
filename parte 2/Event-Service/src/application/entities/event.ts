import { randomUUID } from "crypto";

interface IPropsEvent {
  id?: string;
  name: string;
  ticketNumber: number;
  availableTickets?: number;
  creatorId: string;
  publishedDate?: Date;
  endSellingDate: Date;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Event {
  readonly id: string;
  readonly name: string;
  readonly ticketNumber: number;
  readonly availableTickets: number;
  readonly creatorId: string;
  readonly publishedDate?: Date;
  readonly endSellingDate: Date;
  readonly available: boolean;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;

  constructor(props: IPropsEvent) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.ticketNumber = props.ticketNumber;
    this.availableTickets = props.availableTickets || props.ticketNumber;
    this.creatorId = props.creatorId;
    this.available = props.available || false;
    this.publishedDate = props.publishedDate;
    this.endSellingDate = props.endSellingDate;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
