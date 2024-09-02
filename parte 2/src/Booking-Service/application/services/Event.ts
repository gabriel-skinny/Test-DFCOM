export default abstract class AbstractEventService {
  abstract checkTicketAvailability(
    ticketId: string,
  ): Promise<{ isAvailable: boolean }>;
}
