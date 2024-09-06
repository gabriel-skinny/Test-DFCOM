import { InjectQueue } from "@nestjs/bullmq";
import { Inject, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { AbstractTicketRepository } from "../repositories/ticketRepository";
import { NotFoundError } from "../errors/notFound";
import { ClientKafka } from "@nestjs/microservices";

interface IOrderTicketUseCaseCaseParams {
  eventId: string;
  userId: string;
}

interface IOrderTicketUseCaseReturn {
  ticketId: string;
}

@Injectable()
export class OrderTicketUseCaseCase {
  constructor(
    private ticketRepository: AbstractTicketRepository,
    @Inject("KAFKA_SERVICE")
    private kafkaService: ClientKafka
  ) {}

  async execute({
    eventId,
    userId,
  }: IOrderTicketUseCaseCaseParams): Promise<IOrderTicketUseCaseReturn> {
    const ticketAvailable =
      await this.ticketRepository.findTicketAvailableByEventId(eventId);
    if (!ticketAvailable)
      throw new NotFoundError("Event does not have available tickets anymore");

    this.kafkaService.emit("create-order", {
      ticketId: ticketAvailable.id,
      ticketValue: ticketAvailable.price,
      userId,
    });

    ticketAvailable.makeUnavailable();
    await this.ticketRepository.updateById({
      id: ticketAvailable.id,
      updateData: { isAvailable: ticketAvailable.isAvailable },
    });

    return { ticketId: ticketAvailable.id };
  }
}
