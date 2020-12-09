import { Ticket } from '../types';

export interface ILottery {
    extractWinnerTicket(tickets: Array<Ticket>): Ticket;
}
