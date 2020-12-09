import { Ticket } from '../types';
import { getRandomPositiveInt } from '../utils';
import { ILottery } from './ILottery';

export class FairLottery implements ILottery {
    extractWinnerTicket = (tickets: Array<Ticket>): Ticket => {
        const winnerIndex = getRandomPositiveInt(tickets.length);
        return tickets[winnerIndex];
    };
}
