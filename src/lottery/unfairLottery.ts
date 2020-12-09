import { Store } from '../store';
import { Partecipant, Ticket, UnfairnessConfig } from '../types';
import { getRandomPositiveInt } from '../utils';
import { FairLottery } from './fairLottery';
import { ILottery } from './ILottery';

export class UnfairLottery implements ILottery {
    private favouriteTicketId: number;
    private unfairnessTreshold: number;
    private unfairnessCounter: number;
    private fairLottery: FairLottery;

    constructor(config: UnfairnessConfig, store: Store, partecipants: Array<Partecipant>) {
        this._checkConfig(config, partecipants);

        this.unfairnessTreshold = config.unfairnessThreshold;
        this.unfairnessCounter = config.unfairnessThreshold;
        this.fairLottery = new FairLottery();

        this.favouriteTicketId = store.getPurchasedTicketIdByPartecipant(partecipants[config.partecipantIndex]);
    }

    private _checkConfig = (config: UnfairnessConfig, partecipants: Array<Partecipant>) => {
        if (config.partecipantIndex > partecipants.length - 1) {
            console.error(`config is invalid, favourite partecipant index not present`);
            process.exit(-1);
        }
    };

    private _resetUnfairnessCounter = () => {
        this.unfairnessCounter = this.unfairnessTreshold;
    };

    private extractFavouriteTicket = (tickets: Array<Ticket>): Ticket => {
        for (const t of tickets) {
            if (t.id == this.favouriteTicketId) return t;
        }
        return tickets[0];
    };

    extractWinnerTicket = (tickets: Array<Ticket>): Ticket => {
        if (this.unfairnessCounter > 0) {
            this.unfairnessCounter--;
            return this.fairLottery.extractWinnerTicket(tickets);
        }

        this._resetUnfairnessCounter();
        return this.extractFavouriteTicket(tickets);
    };
}
