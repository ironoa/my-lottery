import { Ticket } from './types';

export const getRandomPositiveInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};

export const generateTickets = (numTickets: number): Array<Ticket> => {
    const tickets: Array<Ticket> = [];
    for (let i = 0; i < numTickets; i++) {
        tickets.push({ id: i });
    }
    return tickets;
};
