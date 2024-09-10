export interface IOrderTicketParams {
  eventId: string;
  userId: string;
}

export interface IPaginationParams {
  perPage: number;
  page: number;
}

export interface IPayoutTicketParams {
  value: { ticketId: string; orderId: string; userId: string };
}

export interface ICreateEventParams {
  creatorId: string;
  name: string;
  endSellingDate: Date;
  ticketGroups: Array<{
    type: string;
    price: number;
    quantity: number;
  }>;
}

export interface IUpdateTicketsValueParams {
  eventId: string;
  newPrice: number;
  type: string;
}
