import { Event } from "../../../application/entities/event";
import { EventModel } from "../entities/event";

export class EventMapper {
  static toDatabase(raw: Event): EventModel {
    return {
      _id: raw.id,
      id: raw.id,
      name: raw.name,
      endSellingDate: raw.endSellingDate,
      publishedDate: raw.publishedDate,
      ticketNumber: raw.ticketNumber,
      available: raw.available,
      availableTickets: raw.availableTickets,
      creatorId: raw.creatorId,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomain(model: EventModel): Event {
    return new Event({
      id: model.id,
      name: model.name,
      endSellingDate: model.endSellingDate,
      publishedDate: model.publishedDate,
      ticketNumber: model.ticketNumber,
      creatorId: model.creatorId,
      available: model.available,
      availableTickets: model.availableTickets,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
      updatedAt: model.updatedAt,
    });
  }
}
