import { Ticket, Partecipant } from './types';
import { getRandomPositiveInt } from './utils';

export class Store {
    private purchasedTickets = new Map<number, Partecipant>();
    private availableTickets: Array<Ticket>;

    constructor(readonly tickets: Array<Ticket>) {
        this.availableTickets = [...tickets];
    }

    reset = (): void => {
        this.purchasedTickets.clear();
    };

    registerPurchases = (partecipant: Partecipant): boolean => {
        for (let i = 0; i < partecipant.desideredTickets; i++) {
            if (!this.registerPurchase(partecipant)) return false;
        }
        return true;
    };

    registerPurchase = (partecipant: Partecipant): boolean => {
        if (this.availableTickets.length <= 0) return false; //superfluous
        const ticketIndex = getRandomPositiveInt(this.availableTickets.length);
        const ticket = this.availableTickets[ticketIndex];
        this.purchasedTickets.set(ticket.id, partecipant);
        this.availableTickets.splice(ticketIndex, 1);
        return true;
    };

    getTicketOwner = (ticketId: number): Partecipant => {
        return this.purchasedTickets.get(ticketId);
    };

    isTicketSold = (ticketId: number): boolean => {
        return this.purchasedTickets.get(ticketId) != undefined;
    };

    getPurchasedTicketIds = (): Array<number> => {
        return [...this.purchasedTickets.keys()];
    };

    getPurchasedTicketIdByPartecipant = (partecipant: Partecipant): number => {
        return [...this.purchasedTickets].find(([, p]) => p == partecipant)[0];
    };
}
