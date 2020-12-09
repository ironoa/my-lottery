export interface InputConfig {
    logLevel: string;
    ticketsM: number;
    partecipants: Array<Partecipant>;
    sampleNumber: number;
    unfairness?: UnfairnessConfig;
}

export interface UnfairnessConfig {
    enabled: boolean;
    partecipantIndex: number;
    unfairnessThreshold: number;
}

export interface Ticket {
    id: number;
}

export interface Partecipant {
    email: string;
    desideredTickets: number;
}

export type Score = Map<Partecipant, number>;

export interface SimulationResult {
    totalWin: number;
    partecipantScores: PartecipantScores;
}

export type PartecipantScores = Map<Partecipant, number>;

export interface Win {
    partecipant: Partecipant;
    ticket: Ticket;
}
