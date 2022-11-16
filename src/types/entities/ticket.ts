export type Ticket = {
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  id: number;
  jenis_tiket: string;
  price: number;
  quota: number;
  remaining_ticket: number;
  ticket_sold: number;
};
