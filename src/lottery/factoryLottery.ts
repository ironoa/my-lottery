import { FairLottery } from './fairLottery';
import { ILottery } from './ILottery';
import { InputConfig, Partecipant } from '../types';
import { UnfairLottery } from './unfairLottery';
import { Store } from '../store';

export const makeLottery = (cfg: InputConfig, store: Store, partecipants: Array<Partecipant>): ILottery => {
    if (cfg.unfairness && cfg.unfairness.enabled) return new UnfairLottery(cfg.unfairness, store, partecipants);

    return new FairLottery();
};
