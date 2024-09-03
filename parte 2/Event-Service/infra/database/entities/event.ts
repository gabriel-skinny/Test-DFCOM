import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<EventModel>;

@Schema({ collection: 'event' })
export class EventModel {
  constructor(eventModel: EventDocument) {
    Object.keys(eventModel).map((key) => (this[key] = eventModel[key]));

    this._id = eventModel.id;
  }

  @Prop()
  _id?: string;

  @Prop({ _id: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  ticketNumber: number;

  @Prop()
  publishedDate: Date;

  @Prop()
  endSellingDate: Date;

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);
