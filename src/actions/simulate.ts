import { InputConfig, Partecipant, Ticket, SimulationResult, PartecipantScores, Win } from '../types';
import { Config } from '../coreUtils/config';
import { createLogger, Logger } from '../coreUtils/logger';
import { generateTickets, getRandomPositiveInt } from '../utils';
import { Store } from '../store';
import { ILottery } from '../lottery/ILottery';
import { makeLottery } from '../lottery/factoryLottery';

export class Simulation {
    private logger: Logger;
    private cfg: InputConfig;
    private partecipants: Array<Partecipant>;
    private tickets: Array<Ticket>;
    private store: Store;
    private lottery: ILottery;

    constructor(cmd: { config: string }) {
        this.cfg = this._loadConfig(cmd);
        this.logger = createLogger(this.cfg.logLevel);

        this._prepareSimulation();
    }

    simulate = (): SimulationResult => {
        const result = this._simulateWinnersExtraction(this.cfg.sampleNumber);

        this._printResults(result);
        return result
    };

    private _loadConfig = (cmd: { config: string }): InputConfig => {
        const cfg = this._parseConfig(cmd)
        if (!this._isConfigValid(cfg)) {
            console.error(`config is invalid, must be M>N`);
            process.exit(-1);
        }
        return cfg;
    };

    private _parseConfig = (cmd: { config: string }): InputConfig => {
      return new Config<InputConfig>().parse(cmd.config);
    }

    private _isConfigValid = (cfg: InputConfig): boolean => {
        return this._isTicketsEnough(cfg);
    };

    private _isTicketsEnough = (cfg: InputConfig): boolean => {
        let partecipantsN = 0;
        for (const partecipant of cfg.partecipants) {
            partecipantsN += partecipant.desideredTickets;
        }
        return partecipantsN <= cfg.ticketsM;
    };

    private _prepareSimulation = () => {
        this.partecipants = this.cfg.partecipants;

        this.tickets = generateTickets(this.cfg.ticketsM);

        this._initStore();

        this.lottery = makeLottery(this.cfg, this.store, this.partecipants);
    };

    private _initStore = (): void => {
        this.store = new Store(this.tickets);
        this._registerPurchases(this.store, this.partecipants);
    };

    private _registerPurchases = (store: Store, partecipants: Array<Partecipant>) => {
        for (const p of partecipants) {
            if (!store.registerPurchases(p)) {
                this.logger.error(`something wrong on registerPurchases`);
                process.exit(-1);
            }
        }
    };

    private _simulateWinnersExtraction = (sampleNumber: number): SimulationResult => {
        const partecipantScores = this._initScore(this.partecipants);
        let totalWin = 0;

        for (let i = 0; i < sampleNumber; i++) {
            const win = this._lotWinner();
            if (win) {
                const winner = win.partecipant;
                totalWin++;
                partecipantScores.set(winner, partecipantScores.get(winner) + 1);
            }
        }
        return { totalWin, partecipantScores };
    };

    private _initScore = (partecipants: Array<Partecipant>): PartecipantScores => {
        const score = new Map<Partecipant, number>();
        for (const p of partecipants) {
            score.set(p, 0);
        }
        return score;
    };

    private _lotWinner = (): Win => {
        const winnerTicket = this.lottery.extractWinnerTicket(this.tickets);
        if (!this.store.isTicketSold(winnerTicket.id)) {
            this.logger.debug(`no winners this time, ticket id was: ${winnerTicket.id}`);
            return null;
        } else {
            const winnerPartecipant = this.store.getTicketOwner(winnerTicket.id);
            this.logger.debug(`The winner is: ${winnerPartecipant.email}`);
            return {
                partecipant: winnerPartecipant,
                ticket: winnerTicket,
            };
        }
    };

    private _printResults = (result: SimulationResult): void => {
        this.logger.info(`SIMULATION RESULT:`);
        this.logger.info(`EMAIL\tWINS\tWIN RATIO`);

        result.partecipantScores.forEach((numWin, partecipant) =>
            this.logger.info(`${partecipant.email}\t${numWin}\t${((numWin * 100) / result.totalWin).toFixed(2)}%`),
        );
    };
}
