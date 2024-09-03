const { randomUUID } = require('crypto');
const {
  EventSchema,
  EventModel,
} = require('../../../../../dist/Event-Service/infra/database/entities/event.js');
const {
  TicketSchema,
  TicketModel,
} = require('../../../../../dist/Event-Service/infra/database/entities/ticket.js');

const mongoose = require('mongoose');
require('dotenv').config();

async function runSeed() {
  const mongoClient = await mongoose.connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DB_NAME}?authSource=admin`,
  );

  const events = [
    {
      id: randomUUID(),
      _id: randomUUID(),
      name: 'Guitar Event Fest',
      ticketNumber: 100,
      publishedDate: new Date(),
      endSellingDate: new Date(),
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    },
    {
      id: randomUUID(),
      _id: randomUUID(),
      name: 'Lollapalloza',
      ticketNumber: 100,
      publishedDate: new Date(),
      endSellingDate: new Date(),
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    },
  ];

  const ticket = {
    id: randomUUID(),
    _id: randomUUID(),
    price: 123,
    buyed: false,
    buyerId: undefined,
    eventId: undefined,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: undefined,
    deletedAt: undefined,
  };

  const EventMongooseModel = mongoose.model(EventModel.name, EventSchema);
  const TicketMongooseModel = mongoose.model(TicketModel.name, TicketSchema);

  for (const event of events) {
    const eventToCreate = new EventMongooseModel(event);

    await eventToCreate.save();

    for (let i = 0; i < event.ticketNumber; i++) {
      ticket.eventId = event.id;
      ticket.id = randomUUID();
      ticket._id = randomUUID();
      const ticketToCreate = new TicketMongooseModel(ticket);

      await ticketToCreate.save();
    }
  }

  await mongoClient.disconnect();
}

runSeed();
