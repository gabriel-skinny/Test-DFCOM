import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TicketDocument = HydratedDocument<TicketModel>;

@Schema({ collection: "ticket" })
export class TicketModel {
  constructor(ticketModel: TicketModel) {
    Object.keys(ticketModel).map((key) => (this[key] = ticketModel[key]));

    this._id = ticketModel.id;
  }

  @Prop()
  _id?: string;

  @Prop({ _id: true })
  id: string;

  @Prop()
  price: number;

  @Prop()
  buyed: boolean;

  @Prop()
  buyerId: string;

  @Prop()
  type: string;

  @Prop()
  eventId: string;

  @Prop()
  isAvailable: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketModel);
