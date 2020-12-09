import process from 'process';
import program from 'commander';

import { Simulation } from './actions/simulate';

program
    .command('simulate')
    .description('Starts the application.')
    .option('-c, --config [path]', 'Path to config file.', './config/main.yaml')
    .action((cmd) => {
        new Simulation(cmd).simulate();
    });

program.allowUnknownOption(false);

program.parse(process.argv);
