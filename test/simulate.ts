import { should } from 'chai';
import { Simulation } from '../src/actions/simulate';
import { Config } from '../src/coreUtils/config';
import { InputConfig, Partecipant } from '../src/types';

should();

const EXPECTED_ERROR = 0.03;
const MIN_SAMPLE = 5000;

const _getTheoreticalPartecipantsWinRatio = (partecipants: Array<Partecipant>): Map<Partecipant, number> => {
    let boughtTickets = 0;
    for (const p of partecipants) {
        boughtTickets += p.desideredTickets;
    }
    const expectedPartecipantWinRatio = new Map<Partecipant, number>();
    for (const p of partecipants) {
        expectedPartecipantWinRatio.set(p, p.desideredTickets / boughtTickets);
    }
    return expectedPartecipantWinRatio;
};

const _checkSampleNumberConfig = (sampleNumber: number) => {
    const isSampleNumberBigEnough = sampleNumber > MIN_SAMPLE;
    if (!isSampleNumberBigEnough) {
        console.error('sample number is not big enough, please modify the config');
        process.exit(-1);
    }
};

describe('Fair Lottery', () => {
    const commanderCfg = {
        config: 'test/config/main.fair.yaml',
    };
    const cfg: InputConfig = new Config<InputConfig>().parse(commanderCfg.config);

    before(async () => {
        _checkSampleNumberConfig(cfg.sampleNumber);
    });

    // after(async () => {
    // });

    describe('with a given fair configuration', () => {
        it('should match the theoretical expectations', async () => {
            const result = new Simulation(commanderCfg).simulate();

            const expectedPartecipantWinRatio = _getTheoreticalPartecipantsWinRatio([
                ...result.partecipantScores.keys(),
            ]);

            for (const [partecipant, score] of result.partecipantScores.entries()) {
                const isBelowError =
                    Math.abs(score / result.totalWin - expectedPartecipantWinRatio.get(partecipant)) < EXPECTED_ERROR;
                isBelowError.should.be.true;
            }
        });
    });
});

describe('Unfair Lottery', () => {
    const commanderCfg = {
        config: 'test/config/main.unfair.yaml',
    };
    const cfg: InputConfig = new Config<InputConfig>().parse(commanderCfg.config);

    before(async () => {
        _checkSampleNumberConfig(cfg.sampleNumber);
    });

    // after(async () => {
    // });

    describe('with a given unfair configuration', () => {
        it('should not match the theoretical expectations', async () => {
            const result = new Simulation(commanderCfg).simulate();

            const expectedPartecipantWinRatio = _getTheoreticalPartecipantsWinRatio([
                ...result.partecipantScores.keys(),
            ]);

            for (const [partecipant, score] of result.partecipantScores.entries()) {
                const isBelowError =
                    Math.abs(score / result.totalWin - expectedPartecipantWinRatio.get(partecipant)) < EXPECTED_ERROR;
                isBelowError.should.be.false;
            }
        });
    });

    describe('with a given unfair configuration', () => {
        it('favourite should sourpass the theoretical expectations', async () => {
            const result = new Simulation(commanderCfg).simulate();

            const expectedPartecipantWinRatio = _getTheoreticalPartecipantsWinRatio([
                ...result.partecipantScores.keys(),
            ]);

            const favouritePartecipant = [...result.partecipantScores.keys()][cfg.unfairness.partecipantIndex];

            const isAboveError =
                result.partecipantScores.get(favouritePartecipant) / result.totalWin -
                    expectedPartecipantWinRatio.get(favouritePartecipant) >
                EXPECTED_ERROR;
            isAboveError.should.be.true;
        });

        it('unfavourites should fall below the theoretical expectations', async () => {
            const result = new Simulation(commanderCfg).simulate();

            const expectedPartecipantWinRatio = _getTheoreticalPartecipantsWinRatio([
                ...result.partecipantScores.keys(),
            ]);

            const favouritePartecipant = [...result.partecipantScores.keys()][cfg.unfairness.partecipantIndex];

            for (const [partecipant, score] of result.partecipantScores.entries()) {
                if (partecipant != favouritePartecipant) {
                    const isBelowExpectations =
                        score / result.totalWin - expectedPartecipantWinRatio.get(partecipant) < -EXPECTED_ERROR;
                    isBelowExpectations.should.be.true;
                }
            }
        });
    });
});
